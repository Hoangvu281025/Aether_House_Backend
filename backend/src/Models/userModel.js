const mongoose = require('mongoose');
const { Schema } = mongoose;


const UserSchema = new Schema({
    name: {type: String},
    email: {type: String, required: true},
    avatar: {
        url: {type: String, required: true},
        public_id: {type: String},
        isDefault: {type: Boolean},
    },
    isActive: {type: Boolean, default: true}, // true hoạt động bth || false bị khóa
    role_id: {type: mongoose.Schema.Types.ObjectId , ref: "Role" , required: true }, 
    modules: {
        type: [String],
        default: [],
    },

    otp: { type: String }, 
    otpExpires: { type: Date }, 
},{
    timestamps: true
})


module.exports = mongoose.model("User" , UserSchema)