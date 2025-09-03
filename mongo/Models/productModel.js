const mongoose = require('mongoose');


const ProductSchema = new mongoose.Schema({
    name: {type: String, required: true},
    slug: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    quantity: {type: Number, required: true},
    colspan: {type: String, required: true},
    images: [{type: String, required: true}],
    is_hidden: {type: Boolean, default: false},
    category_id: [{
        type: mongoose.Schema.Types.ObjectId , ref: "category" , required: true
    }],
},{
    timestamps: true
})


module.exports = mongoose.model("Product" , ProductSchema)