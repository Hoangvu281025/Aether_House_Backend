const mongoose = require('mongoose');
const { Schema } = mongoose;


const orderSchema = new Schema({
    total_amount: {type: Number, required: true},
    address_id: {type: mongoose.Types.ObjectId , ref : "Address" , required: true},
    user_id: {type: mongoose.Types.ObjectId , ref : "User" , required: true},
    voucher_id: {type: mongoose.Types.ObjectId , ref : "Voucher" , required: false},
    status: { 
        type: String, 
        enum: ["pending", "prepare", "shipping", "completed", "canceled"], 
        default: "pending" 
    },
    payment_method: {type: String ,enum: ["COD", "BANK_TRANSFER"], required:true}
},{
    timestamps: true
})


module.exports = mongoose.model("Order" , orderSchema)