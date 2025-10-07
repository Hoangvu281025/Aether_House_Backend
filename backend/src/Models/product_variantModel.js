const mongoose = require('mongoose');
const { Schema } = mongoose;


const ProductVariantSchema = new Schema({
  Variation: [{
    color: { type: String, required: true },
    images: [{
      url: { type: String, required: true },
      public_id: { type: String, required: true }
    }],
    hex: { type: String, default: "" }
  }],
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
}, {
  timestamps: true
});


module.exports = mongoose.model("Product_Variant" , ProductVariantSchema)