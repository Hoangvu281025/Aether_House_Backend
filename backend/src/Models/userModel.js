const mongoose = require('mongoose');
const { Schema } = mongoose;


const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    avatar: {
        url: {type: String, required: true},
        public_id: {type: String},
        localPath: {type: String},
    },
    isActive: {type: Boolean, default: true}, // true hoạt động bth || false bị khóa
    role_id: {type: mongoose.Schema.Types.ObjectId , ref: "Role" , required: true }, 
    modules: {
        type: [String],
        enum: ["all", "product", "category", "order", "user" , "store" ,], // tuỳ bạn
        default: [],
    },

    approvalStatus: {
        type: String,
        enum: ['pending', 'approved'],
        default: 'pending'
    }
},{
    timestamps: true
})


module.exports = mongoose.model("User" , UserSchema)