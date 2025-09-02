const mongoose = require('mongoose');


const voucherSchema = new mongoose.Schema({
    value: {type: Number, required: true},
    voucher_code: {type: String, required: true},
    quantity: {type: Number, required: true},
    min_total: {type: Number, required: true},
    max_total: {type: Number, required: true},
    description: {type: String, required: true},
    isActive: {type: Boolean, default: true}, // true hoạt động bth || false bị khóa
},{
    timestamps: true
})


module.exports = mongoose.model("Voucher" , voucherSchema)