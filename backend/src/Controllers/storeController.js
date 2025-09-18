const cloudinary = require("../config/cloudinary");
const Store = require("../Models/storeModel");

// Lấy tất cả store
const getAllStores = async (req, res) => {
  // find là lấy tất cả ,200 lấy thành công
  try {
    const stores = await Store.find();
    res.status(200).json({ success: true, stores });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Lấy store theo ID
// req.params; lấy id trên url
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



const addStore = async (req, res) => {
  try {
    const { name, phone, email, city, address, information, description } = req.body;
    const file = req.file;

    // length đếm số phần tử trong mảng,nếu bằng 0 thì trả về lỗi
    if (!file) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    const uploadedImages = [];

    if (!file) {
        return res.status(400).json({ error: 'Image file is required' });
    }
    const localPath = file.path;

    const Uploadresults = await cloudinary.uploader.upload(localPath, { folder: 'AetherHouse/stores' });
    uploadedImages.push({
      url: Uploadresults.secure_url,
      public_id: Uploadresults.public_id,
      localPath: localPath
    });

    // Thêm csdl
    const newStore = await Store.create({
      name,
      phone,
      email,
      city,
      address,
      information,
      description,
      images: uploadedImages,
    });

    res.status(201).json({ success: true, store: newStore });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Cập nhật store
// tạo đối tượng updates để lưu trữ các trường cần cập nhật
const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Nếu có upload ảnh mới thì upload lên Cloudinary,có thể ktra có sp hay chưa nếu chưa thì báo(fix lại)
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

    // findByIdAndUpdate cập nhật thằng nào thằng đó ra thoi,ko ra hết
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
// findById kiểm tra có hay không 
const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findById(id);

    if (!store) {
      return res.status(404).json({ success: false, message: "Store not found" });
    }

    // Xóa ảnh trên Cloudinary
    for (const img of store.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    // deleteOne xóa 1 lần
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
  addStore,
  updateStore,
  deleteStore,
};
