const mongoose = require('mongoose');
require('dotenv').config();


async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Kết nối MongoDB thành công!');
    } catch (err) {
        console.error('Lỗi kết nối MongoDB:', err);
    }
}

connectDB();
