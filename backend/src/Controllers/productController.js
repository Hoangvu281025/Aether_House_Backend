const cloudinary = require('../config/cloudinary');
const Category = require('../Models/categoryModel');
const Product = require('../Models/productModel');
const ProductVariant = require("../Models/product_variantModel");
const { toSlug } = require('../utils/slugify');

const getall = async (req, res) => {
  try {
    const products = await Product.find({ is_hidden: false }).populate("category_id");
    res.json({ success: true, products });

   
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const getProductsByParentSlug = async (req, res) => {
  try {
    const { parentSlug } = req.params;

    // Tìm category cha theo slug
    const parent = await Category.findOne({ slug: parentSlug });
    if (!parent) {
      return res.status(404).json({ success: false, message: "Parent category not found" });
    }

    // Lấy con trực tiếp của cha
    const children = await Category.find({ parentId: parent._id });
    const categoryIds = [parent._id, ...children.map(c => c._id)];

    // Query sản phẩm thuộc cha + con
    const products = await Product.find({ category_id: { $in: categoryIds } })
      .populate("category_id")

    res.json({ success: true, products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getProductsByChildSlug = async (req, res) => {
  try {
    const { parentSlug, childSlug } = req.params;

    // Tìm cha
    const parent = await Category.findOne({ slug: parentSlug });
    if (!parent) {
      return res.status(404).json({ success: false, message: "Parent category not found" });
    }

    // Tìm con trực tiếp thuộc cha
    const child = await Category.findOne({ slug: childSlug, parentId: parent._id });
    if (!child) {
      return res.status(404).json({ success: false, message: "Child category not found under this parent" });
    }

    // Query sản phẩm theo con
    const products = await Product.find({ category_id: child._id })
      .populate("category_id")

    res.json({ success: true, parent, child, products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getByIDpro = async (req , res) => {
    try {
        const product_id = req.params.id;

        const product = await Product.findOne({ _id: product_id , is_hidden: false}).populate('category_id');
        if(!product) return res.status(404).json({ success: false , errer: "Product not found or hidden"});



        const variantDoc = await ProductVariant
      .findOne({ product_id: product._id })
      .select("Variation")
      .lean();

    return res.status(200).json({
      success: true,
      product,
      variations: variantDoc?.Variation || [],
    });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error : 'Internal server error'
        })
    }   
}


const addProduct = async (req , res) => {
    try {
        const { name,  price, description, quantity, colspan , category_id } = req.body;
        const slug = toSlug(name);
        const files = req.files || [];
        if (files.length === 0) return res.status(400).json({ error: 'No files uploaded' });
        const uploadedImages = [];
            for (let i= 0; i < files.length; i++) {
                const file = files[i];
                const localPath = file.path;
                const results = await cloudinary.uploader.upload(localPath, { folder: `AetherHouse/products/${name}` });
                uploadedImages.push({
                    url: results.secure_url,
                    public_id: results.public_id,
                    localPath: localPath,
                    is_main: i === 0
                });
            }
        const newProduct = await Product.create({ 
            name, 
            slug, 
            price, 
            description, 
            quantity, 
            colspan ,
            images: uploadedImages,
            category_id: category_id,
        })
        res.status(200).json({
            success_true: true,
            id: newProduct._id,
            products: newProduct
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error : 'Internal server error'
        })
    }
}

const updateProduct = async (req , res) => {
    try {
        const { name, category_id } = req.body;
        const slug = toSlug(name);
        const category = await Category.findOne({ _id:category_id , status: "active"});
        if(!category) return res.status(400).json({ error: "name and slug requied"})

        // Kiểm tra trùng name
        if (name) {
            const nameExists = await Category.findOne({ name, _id: { $ne: category_id } });
            if (nameExists) return res.status(400).json({ error: "Category name already exists" });
            category.name = name;
        }

        

        
        res.status(200).json({
            success: true,
            categories : updateCategory
        })
    } catch (error) {
        res.status(500).json({
            error : 'Internal server error'
        })
    }
}
const deleteProduct  = async (req , res) => {
    try {
        const category_id = req.params.id;

        const category = await Category.findById(category_id);
        if(!category) return res.status(400).json({ error: " requied"})

        category.status = (category.status == "active") ? 'inactive' : 'active';

        await category.save();
        await Product.updateMany({ category: category_id }, { is_hidden: category.status === 'inactive' });
        res.status(200).json({
            success: true,
            categories : updateCategory
        })
    } catch (error) {
        res.status(500).json({
            error : 'Internal server error'
        })
    }
}




module.exports = {
    getall,
    getProductsByParentSlug,
    getProductsByChildSlug,
    getByIDpro,
    addProduct,
    updateProduct,
    deleteProduct
}