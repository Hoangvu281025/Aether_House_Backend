const mongoose = require('mongoose');
require('dotenv').config();


async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI_1, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Kết nối MongoDB thành công!');
    } catch (err) {
        console.error('Lỗi kết nối MongoDB:', err);
    }
}

module.exports = connectDB;


