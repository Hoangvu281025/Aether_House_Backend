const mongoose = require('mongoose');
const { Schema } = mongoose;
const ObjectId = Schema.ObjectId;

const CategorySchema = new Schema({
    name: {type: String, required: true},
    slug: {type: String, required: true},
    parentId: { type: ObjectId, default: null },
    status: { type: String, enum: ['active', 'unactive'], default: 'active' }
},{
    timestamps: true
})


module.exports = mongoose.model("Category" , CategorySchema)