const mongoose = require('mongoose');
const slugify = require('slugify');

const storeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true, lowercase: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    information: { type: String, required: true },
    description: { type: String, required: true },
    images: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
      localPath: { type: String, required: true },
    }
}, {
    timestamps: true
});

storeSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

module.exports = mongoose.model('Store', storeSchema);
