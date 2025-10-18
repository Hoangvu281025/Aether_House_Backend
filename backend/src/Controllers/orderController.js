const mongoose = require("mongoose");        
const Order = require("../Models/orderModel");
const OrderDetail = require("../Models/order_detailModel");
const ProductVariant = require("../Models/product_variantModel");
const Voucher = require("../Models/voucherModel"); 
require("../Models/addressModel")
require("../Models/userModel");

// 📌 Tạo Order + OrderDetail
exports.createOrder = async (req, res) => {
    try {
        const { total_amount, address_id, voucher_id, status, orderDetails , user_id } = req.body;

        // Tạo Order
        const order = await Order.create({
            total_amount,
            address_id,
            user_id,
            voucher_id: voucher_id || null,
            status: status || "pending"
        });

        // Nếu có orderDetails thì lưu
        let details = [];
        if (orderDetails && Array.isArray(orderDetails)) {
            details = await Promise.all(orderDetails.map(d => {
                return OrderDetail.create({
                    order_id: order._id,
                    product_id: d.product_id,
                    productvariant_id: d.productvariant_id,
                    quantity: d.quantity,
                    price: d.price
                });
            }));
        }

        // 👉 Trừ số lượng voucher nếu có
        if (voucher_id) {
            const updatedVoucher = await Voucher.findByIdAndUpdate(
                voucher_id,
                { $inc: { quantity: -1 } },
                { new: true }
            );

            // Nếu voucher hết lượt dùng thì tự disable
            if (updatedVoucher && updatedVoucher.quantity <= 0) {
                updatedVoucher.isActive = false;
                await updatedVoucher.save();
            }
        }

        res.status(201).json({
            message: "Order created successfully",
            order,
            orderDetails: details
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// 📌 Lấy tất cả Orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("address_id")
            .populate("voucher_id")
            .populate("user_id")
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// 📌 Lấy chi tiết 1 Order
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    // 1) Lấy order + address + voucher + user
    const order = await Order.findById(id)
      .populate({ path: "address_id" })
      .populate({ path: "voucher_id", select: "voucher_code value description isActive" })
      .populate({ path: "user_id", select: "name email" }) // <-- thêm user
      .lean();

    if (!order) return res.status(404).json({ message: "Order not found" });

    // 2) Lấy chi tiết + product cơ bản
    const details = await OrderDetail.find({ order_id: order._id })
      .populate({ path: "product_id", select: "name images price" })
      .lean();

    // 3) Gom tất cả _id subdoc variant cần tra và ép về ObjectId
    const variantSubdocIdsRaw = details.map(d => d.productvariant_id).filter(Boolean);
    const variantSubdocIds = variantSubdocIdsRaw.map(x =>
      typeof x === "string" ? new mongoose.Types.ObjectId(x) : x
    );

    let variantMap = new Map();

    if (variantSubdocIds.length) {
      // 4) Tạo map subdocId -> { colorName, hex, images } bằng aggregate
      const rows = await ProductVariant.aggregate([
        { $unwind: "$Variation" },
        { $match: { "Variation._id": { $in: variantSubdocIds } } },
        {
          $project: {
            _id: 0,
            variantId: "$Variation._id",
            colorName: "$Variation.color", // đổi field nếu schema khác
            hex: "$Variation.hex",
            images: "$Variation.images",
          }
        }
      ]);

      rows.forEach(r => {
        variantMap.set(String(r.variantId), {
          colorName: r.colorName,
          hex: r.hex,
          images: r.images || []
        });
      });
    }

    // 5) Gắn tên màu/hex vào từng detail
    const enrichedDetails = details.map(d => {
      const info = variantMap.get(String(d.productvariant_id)) || null;
      return {
        ...d,
        variant_info: info ? {
          name: info.colorName,
          hex: info.hex,
          images: info.images
        } : null
      };
    });

    // 6) Trả về (kèm user/address/voucher cho FE dùng trực tiếp)
    return res.status(200).json({
      order,
      user: order.user_id || null,
      address: order.address_id || null,
      voucher: order.voucher_id || null,
      orderDetails: enrichedDetails
    });

  } catch (err) {
    console.error("[getOrderById] error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 📌 Cập nhật trạng thái Order
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatus = ["pending", "prepare", "shipping", "completed", "canceled"];
        if (!validStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.status = status;
        await order.save();

        res.status(200).json({ message: "Order status updated", order });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user?.id; // từ verifyToken
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { status } = req.query; // optional: completed/pending/...

    const findCond = { user_id: userId };
    if (status) findCond.status = status;

    // 1) Lấy danh sách Order của user
    const orders = await Order.find(findCond)
      .populate({ path: "address_id" })
      .populate({ path: "voucher_id", select: "voucher_code value description isActive" })
      .populate({ path: "user_id", select: "name email" })
      .sort({ createdAt: -1 })
      .lean();

    if (orders.length === 0) {
      return res.status(200).json({ orders: [], detailsByOrder: {} });
    }

    // 2) Lấy toàn bộ OrderDetail của các order này
    const orderIds = orders.map(o => o._id);
    const details = await OrderDetail.find({ order_id: { $in: orderIds } })
      .populate({ path: "product_id", select: "name images price" })
      .lean();

    // 3) Lấy tên màu từ subdocument Variation
    const mongoose = require("mongoose");
    const ProductVariant = require("../Models/product_variantModel");

    const variantIdsRaw = details.map(d => d.productvariant_id).filter(Boolean);
    const variantIds = variantIdsRaw.map(x =>
      typeof x === "string" ? new mongoose.Types.ObjectId(x) : x
    );

    let variantMap = new Map();
    if (variantIds.length) {
      const rows = await ProductVariant.aggregate([
        { $unwind: "$Variation" },
        { $match: { "Variation._id": { $in: variantIds } } },
        { $project: {
            _id: 0,
            variantId: "$Variation._id",
            colorName: "$Variation.color",
            hex: "$Variation.hex",
            images: "$Variation.images"
        } }
      ]);
      rows.forEach(r => {
        variantMap.set(String(r.variantId), {
          name: r.colorName,
          hex: r.hex,
          images: r.images || []
        });
      });
    }

    const enriched = details.map(d => ({
      ...d,
      variant_info: variantMap.get(String(d.productvariant_id)) || null
    }));

    // 4) Nhóm details theo order_id để FE dễ render
    const detailsByOrder = {};
    for (const d of enriched) {
      const key = String(d.order_id);
      if (!detailsByOrder[key]) detailsByOrder[key] = [];
      detailsByOrder[key].push(d);
    }

    return res.status(200).json({ orders, detailsByOrder });
  } catch (err) {
    console.error("[getMyOrders] error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};