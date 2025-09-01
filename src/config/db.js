const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI_1);
        console.log('connect DB success');
    } catch (err) {
        console.log('DB connect error' , err);
        process.exit(1);
    }
}

module.exports = connectDB;