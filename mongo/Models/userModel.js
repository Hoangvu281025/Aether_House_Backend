const mongoose = require('mongoose');
const { Schema } = mongoose;


const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    avatar: {type: String, required: true},
    isActive: {type: Boolean, default: true}, // true hoạt động bth || false bị khóa
    roles: {type: String, enum: ["0" , "1"] , default: "0"}, // 0 user  || 1 admin
},{
    timestamps: true
})


module.exports = mongoose.model("User" , UserSchema)