const mongoose = require('mongoose');
const { Schema } = mongoose;


const AddressSchema = new Schema({
    name: {type: String, required: true},
    address: {type: String, required: true},
    detail: {type: String, required: true},
    phone: {type: String, required: true},
    user_id: {type: mongoose.Schema.Types.ObjectId , ref: "User"},
},{
    timestamps: true
})


module.exports = mongoose.model("Address" , AddressSchema)