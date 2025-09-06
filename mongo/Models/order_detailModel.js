const mongoose = require('mongoose');
const { Schema } = mongoose;


const orderdetailSchema = new Schema({
    quantity: {type: Number, required: true},
    price: {type: Number, required: true}, //lưu giá bán hiện tại
    order_id: {type: mongoose.Types.ObjectId , ref : "Order" , required: true},
    product_id: {type: mongoose.Types.ObjectId , ref : "Product" , required: true},
    productvariant_id: {type: mongoose.Types.ObjectId , ref : "ProductVariant" , required: true},
    
},{
    timestamps: true
})


module.exports = mongoose.model("OrderDetail" , orderdetailSchema)