const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    information: { type: String, required: true },
    desctription: { type: String, required: true },
    images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true }
    }
  ]  
}, {
    timestamps: true
});

module.exports = mongoose.model('Store', storeSchema);
