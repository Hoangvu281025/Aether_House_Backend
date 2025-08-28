const mongoose = require('mongoose');

const Schema = mongoose.Schema
const userSchema = new Schema({
    username: String,
    password: String
},{
    collection: 'user'
});

const userModule = mongoose.model('user' , userSchema);

module.exports = userModule