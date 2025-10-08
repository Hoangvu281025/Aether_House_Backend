const cloudinary = require("../config/cloudinary");
const storeModel = require("../Models/storeModel");
// const Store = require("../Models/storeModel");
const {toSlug} = require("../utils/slugify");
const fs = require("fs");

const getAllStores = async (req, res) => {
  try {
    const stores = await storeModel.find();
    res.status(200).json({ success: true, stores });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await storeModel.findById(id);
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
    const store = await storeModel.findOne({ slug });
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
    const slug = toSlug(city);
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    const Path = file.path;
    const Uploadresults = await cloudinary.uploader.upload(Path, { folder: 'AetherHouse/stores' });

    const newStore = await storeModel.create({
      name,
      slug,
      phone,
      email,
      city,
      address,
      information,
      description,
      images:{
        url: Uploadresults.secure_url,
        public_id: Uploadresults.public_id,
      },
    });

    fs.unlink(Path, () => {});
    

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
    console.log("Updating store with ID:", id);

    const store = await storeModel.findById(id);
    if (!store) {
      return res.status(404).json({ success: false, message: "Store not found" });
    }

    const { name, phone, email, city, address, information, description } = req.body;
    let images = store.images;
    if (req.file?.path) {
      const up = await cloudinary.uploader.upload(req.file.path, {
        folder: 'AetherHouse/stores'
      });

      // gán ảnh mới vào updates
      images = {
        url: up.secure_url,
        public_id: up.public_id,
      };

      // xoá ảnh cũ (nếu có)
      if (store.images?.public_id) {
        try {
          await cloudinary.uploader.destroy(store.images.public_id);
        } catch (e) {
          console.warn("[destroy old image failed]", e?.message);
        }
      }
    }
    let slug = store.slug;
    slug = toSlug(store.city);
    const updatedStore = await storeModel.findByIdAndUpdate(id, { name, slug, phone, email, city, address, information, description , images }, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({ success: true, store: updatedStore });
  } catch (error) {
    console.error("[updateStore]", error);
    return res.status(500).json({ success: false, message: "Server error" });
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
