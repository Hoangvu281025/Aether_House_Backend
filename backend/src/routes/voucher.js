const express = require("express");
const router = express.Router();
const voucherController = require("../Controllers/voucherController");

router.post("/", voucherController.createVoucher);
router.get("/", voucherController.getVouchers);
router.get("/eligible", voucherController.getEligibleVouchers);
router.get("/:id", voucherController.getVoucherById);
router.put("/:id", voucherController.updateVoucher);
router.delete("/:id", voucherController.deleteVoucher);

module.exports = router;
