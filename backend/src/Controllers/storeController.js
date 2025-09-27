const cloudinary = require("../config/cloudinary");
const Store = require("../Models/storeModel");
const slugify = require("slugify");

const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find();
    res.status(200).json({ success: true, stores });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findById(id);
    if (!store) {
      return res.status(404).json({ success: false, message: "Store not found" });
    }
    res.status(200).json({ success: true, store });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getStoreBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const store = await Store.findOne({ slug });
    if (!store) {
      return res.status(404).json({ success: false, message: "Store not found" });
    }
    res.status(200).json({ success: true, store });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Tạo store
const addStore = async (req, res) => {
  try {
    const { name, phone, email, city, address, information, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    const localPath = file.path;
    const Uploadresults = await cloudinary.uploader.upload(localPath, { folder: 'AetherHouse/stores' });

    const newStore = await Store.create({
      name,
      slug: slugify(name, { lower: true, strict: true }), 
      phone,
      email,
      city,
      address,
      information,
      description,
      images:{
        url: Uploadresults.secure_url,
        public_id: Uploadresults.public_id,
        localPath: localPath
      },
    });

    res.status(201).json({ success: true, store: newStore });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Cập nhật store
const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Nếu update tên thì cũng cập nhật slug
    if (updates.name) {
      updates.slug = slugify(updates.name, { lower: true, strict: true });
    }

    // Upload ảnh mới nếu có
    if (req.files && req.files.length > 0) {
      const uploadedImages = [];
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const result = await cloudinary.uploader.upload(file.path, { folder: "Stores" });
        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
      updates.images = uploadedImages;
    }

    const updatedStore = await Store.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedStore) {
      return res.status(404).json({ success: false, message: "Store not found" });
    }

    res.status(200).json({ success: true, store: updatedStore });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Xóa store
const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findById(id);

    if (!store) {
      return res.status(404).json({ success: false, message: "Store not found" });
    }

    // Xóa ảnh trên Cloudinary (chú ý: hiện images của em không phải mảng, nếu muốn nhiều thì đổi sang array)
    await cloudinary.uploader.destroy(store.images.public_id);

    await store.deleteOne();

    res.status(200).json({ success: true, message: "Store deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getAllStores,
  getStoreById,
  getStoreBySlug,
  addStore,
  updateStore,
  deleteStore,
};
