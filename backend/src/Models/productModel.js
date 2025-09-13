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
        localPath: {type: String, required: true},
        is_main: {type: Boolean , required:false }
    }],
    is_hidden: {type: Boolean, default: false},
    category_id: {type: mongoose.Schema.Types.ObjectId , ref: "Category" , required: true},
    
},{
timestamps: true
}
)


module.exports = mongoose.model("Product" , ProductSchema)