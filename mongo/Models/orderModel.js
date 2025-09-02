const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    total_amount: {type: Number, required: true},
    address_id: {type: mongoose.Types.ObjectId , ref : "Address" , required: true},
    voucher_id: {type: mongoose.Types.ObjectId , ref : "Voucher" , required: false},
    status: { 
        type: String, 
        enum: ["pending", "prepare", "shipping", "completed", "canceled"], 
        default: "pending" 
    },
},{
    timestamps: true
})


module.exports = mongoose.model("Order" , orderSchema)