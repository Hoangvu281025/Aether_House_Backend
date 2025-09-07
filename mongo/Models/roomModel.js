const mongoose = require('mongoose');
const { Schema } = mongoose;

const RoomSchema = new Schema({
    name: {type: String, required: true},
    slug: {type: String, required: true},
    status: { type: String, enum: ['active', 'unactive'], default: 'active' }
},{
    timestamps: true
})


module.exports = mongoose.model("Room" , RoomSchema)