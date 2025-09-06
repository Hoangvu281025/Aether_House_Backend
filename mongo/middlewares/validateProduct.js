// middlewares/validateProduct.js
const Product = require('../Models/productModel');
const Category = require('../Models/categoryModel');

const validateProduct = async (req, res, next) => {
  const { name, category_id } = req.body;

  // Kiểm tra name và slug đã được cung cấp chưa
  if (!name) {
    return res.status(400).json({ error: "Name  required" });
  }

  // Kiểm tra trùng tên sản phẩm
  const nameExists = await Product.findOne({ name });
  if (nameExists) {
    return res.status(400).json({ error: "Product name already exists" });
  }


  // Kiểm tra category_id hợp lệ
  const category = await Category.findById(category_id);
  if (!category) {
    return res.status(400).json({ error: "Invalid category ID" });
  }
  
  next();
};

module.exports = validateProduct;
