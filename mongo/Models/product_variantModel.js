const mongoose = require('mongoose');
const { Schema } = mongoose;


const ProductVariantSchema = new Schema({
    Variation: [{
        color: {type: String, required: true},
        imagers: [{type: String, required: true}]
    }],
    product_id: {
        productId: {type: mongoose.Schema.Types.ObjectId , ref: "Product" , required: true},
    },
},{
    timestamps: true
})


module.exports = mongoose.model("Product_Variant" , ProductVariantSchema)