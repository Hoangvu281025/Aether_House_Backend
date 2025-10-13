const mongoose = require('mongoose');
const { Schema } = mongoose;


const ProductSchema = new Schema({
    name: {type: String, required: true},
    slug: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    quantity: {type: Number, required: true},
    colspan: {type: Number, enum: [1, 2],default: 1, required: true},
    images: [{
        url: {type: String, required: true},
        public_id: {type: String, required: true},
        is_main: {type: Boolean , required:false }
    }],
    is_hidden: {type: Boolean, default: false},
    category_id: {type: mongoose.Schema.Types.ObjectId , ref: "Category" , required: true},
},{
timestamps: true
}
)


// ⬇⬇⬇ Virtual: nối 1-1 tới document Product_Variant của product
ProductSchema.virtual('variantsDoc', {
  ref: 'Product_Variant',
  localField: '_id',
  foreignField: 'product_id',
  justOne: true, // mỗi product có 1 doc Product_Variant
});

// để virtual xuất hiện khi res.json()
ProductSchema.set('toObject', { virtuals: true });
ProductSchema.set('toJSON',   { virtuals: true });


module.exports = mongoose.model("Product" , ProductSchema)