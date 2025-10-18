const Voucher = require("../Models/voucherModel");

// 📌 Tạo voucher
exports.createVoucher = async (req, res) => {
    try {
        const { value, voucher_code, quantity, min_total, max_total, description, isActive } = req.body;

        const voucher = await Voucher.create({
            value,
            voucher_code,
            quantity,
            min_total,
            max_total,
            description,
            isActive
        });

        res.status(201).json({ message: "Voucher created successfully", voucher });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// 📌 Lấy tất cả vouchers
exports.getVouchers = async (req, res) => {
    try {
        const vouchers = await Voucher.find().sort({ createdAt: -1 });
        res.status(200).json(vouchers);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getEligibleVouchers = async (req, res) => {
  try {
    const total = Number(req.query.total || 0);

    const filter = {
      isActive: true,
      quantity: { $gt: 0 },
      min_total: { $lte: total },
      max_total: { $gte: total },
    };

    const vouchers = await Voucher.find(filter)
      .sort({ value: -1, createdAt: -1 })
      .lean();

    res.status(200).json({ total, count: vouchers.length, vouchers });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 📌 Lấy voucher theo ID
exports.getVoucherById = async (req, res) => {
    try {
        const voucher = await Voucher.findById(req.params.id);
        if (!voucher) return res.status(404).json({ message: "Voucher not found" });

        res.status(200).json(voucher);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// 📌 Cập nhật voucher
exports.updateVoucher = async (req, res) => {
    try {
        const voucher = await Voucher.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!voucher) return res.status(404).json({ message: "Voucher not found" });

        res.status(200).json({ message: "Voucher updated successfully", voucher });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// 📌 Xóa voucher
exports.deleteVoucher = async (req, res) => {
    try {
        const voucher = await Voucher.findByIdAndDelete(req.params.id);
        if (!voucher) return res.status(404).json({ message: "Voucher not found" });

        res.status(200).json({ message: "Voucher deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
