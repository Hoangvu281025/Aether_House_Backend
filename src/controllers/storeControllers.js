const Store = require('../models/Store');

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

    if (!name || !city || !address) {
      return res.status(400).json({ message: "Tên, thành phố và địa chỉ là bắt buộc" });
    }

    const store = new Store({
      name,
      phone,
      email,
      city,
      address,
      information,
      description
    });

    await store.save();

    res.status(201).json({ message: "Store added successfully", data: store });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Add not success", error: error.message });
  }
};