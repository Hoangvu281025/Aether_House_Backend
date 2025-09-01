const Store = require('../models/Store');
const uploadToCloudinary = require("../utils/uploadCloudinary");

// Lấy danh sách store
exports.getStores = async (req, res) => {
  try {
    const stores = await Store.find();
    if(stores.length === 0){
       res.status(400).json({message: "no data"})
    }
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    res.json(store);
  } catch (error) {
    res.status(404).json({ message: "Store not found" });
  }
};


exports.addStore = async (req, res) => {
  try {
    const { name, phone, email, city, address, information, description } = req.body;
    if (!name || !phone || !email || !city || !address || !information || !description) return res.status(400).json({ message: "Thiếu thông tin" });
    if (!req.files || req.files.length === 0) return res.status(400).json({ message: "Chưa upload ảnh" });



   const uploadedUrls = await Promise.all(
    req.files.map(async (file) => {
        const resCloud = await uploadToCloudinary.uploadToCloudinary(file.buffer);
        console.log(resCloud);
        return {
        url: resCloud.secure_url,
        public_id: resCloud.public_id
        };
    })
    );


    // Tạo store + lưu link ảnh
    const store = new Store({
      name,
      phone,
      email,
      city,
      address,
      information,
      description,
      images: uploadedUrls
    });

    await store.save();

    res.status(201).json({ message: "Store added successfully", data: store });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Add not success", error: error.message });
  }
};




exports.deleteStore = async (req , res) => {
    try {
        const Store_id = req.params.id;

        const store = await Store.findById(Store_id)
        if (!store) return res.status(404).json({ message: "Store not found" });

        for (let img of store.images) {
            await uploadToCloudinary.deleteFromCloudinary(img.public_id)
        }

        await Store.findByIdAndDelete(Store_id);
        res.status(200).json({ message: "Store and its images deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(404).json({
            message: "err"
        })
    }
}