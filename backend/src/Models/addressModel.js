const mongoose = require('mongoose');
const { Schema } = mongoose;


const AddressSchema = new Schema({
    name: {type: String, required: true},
    address: {type: String, required: true},
    city: {type: String, required: true},
    ward: { type: String, default: "", trim: true },
    country: { type: String, default: "Vietnam", trim: true },
    phone: {type: String, required: true},
    is_default: { type: Boolean, default: false },
    user_id: {type: mongoose.Schema.Types.ObjectId , ref: "User"},
},{
    timestamps: true
})


module.exports = mongoose.model("Address" , AddressSchema)