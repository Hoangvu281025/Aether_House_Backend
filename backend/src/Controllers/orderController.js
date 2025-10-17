const Order = require("../Models/orderModel");
const OrderDetail = require("../Models/order_detailModel");
const Voucher = require("../Models/voucherModel");

// 📌 Tạo Order + OrderDetail
exports.createOrder = async (req, res) => {
    try {
        const { total_amount, address_id, voucher_id, status, orderDetails } = req.body;

        // Tạo Order
        const order = await Order.create({
            total_amount,
            address_id,
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
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// 📌 Lấy chi tiết 1 Order
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("address_id")
            .populate("voucher_id");

        if (!order) return res.status(404).json({ message: "Order not found" });

        const details = await OrderDetail.find({ order_id: order._id })
            .populate("product_id")
            .populate("productvariant_id");

        res.status(200).json({ order, orderDetails: details });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
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
