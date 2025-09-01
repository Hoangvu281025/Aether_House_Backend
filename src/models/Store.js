const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    information: { type: String, required: true },
    description: { type: String, required: true },
    imageList: { type: String, required: false  },   
    imageDetail: { type: String, required: false  }, 
}, {
    timestamps: true
});

module.exports = mongoose.model('Store', storeSchema);
