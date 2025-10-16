const cloudinary = require('../config/cloudinary');
const Category = require('../Models/categoryModel');
const Product = require('../Models/productModel');
const ProductVariant = require("../Models/product_variantModel");
const { toSlug } = require('../utils/slugify');

const getall = async (req, res) => {
  try {
    const { is_hidden } = req.query;

    const filter = {};
    if (typeof is_hidden !== 'undefined') {
      const toBool = (v) => ['1','true','yes','on'].includes(String(v).toLowerCase());
      filter.is_hidden = toBool(is_hidden); // true/false theo query
    }

    const docs = await Product.find(filter)
      .populate('category_id')
      .populate({ path: 'variantsDoc', select: 'Variation' })
      .lean();

    const products = docs.map(p => {
      const variants = p?.variantsDoc?.Variation || [];
      return { ...p, variants, variants_count: variants.length };
    });

    res.json({ success: true, products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const getProductsByParentSlug = async (req, res) => {
  try {
    const { parentSlug } = req.params;
    const { sort } = req.query; // price_asc | price_desc

    // 1) Tìm category cha
    const parent = await Category.findOne({ slug: parentSlug });
    if (!parent) {
      return res.status(404).json({ success: false, message: "Parent category not found" });
    }

    // 2) Lấy con trực tiếp của cha
    const children = await Category.find({ parentId: parent._id }).select('_id');
    const categoryIds = [parent._id, ...children.map(c => c._id)];

    // 3) Xác định sort
    let sortObj = {};
    if (sort === 'price_asc')      sortObj = { price: 1 };
    else if (sort === 'price_desc') sortObj = { price: -1 };
    // (tuỳ chọn) default sort: mới nhất trước
    else                            sortObj = { createdAt: -1 };

    // 4) Query sản phẩm
    const products = await Product.find({ category_id: { $in: categoryIds } })
      .populate('category_id')
      .sort(sortObj); // <— áp dụng sort ở đây

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

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files || [];

    // 1) Build $set từ body
    const {
      name,
      price,
      description,
      quantity,
      colspan,
      category_id,
    } = req.body;

    const $set = {};
    if (name !== undefined && name !== "") {
      $set.name = name;
      $set.slug = toSlug(name);
    }
    if (price !== undefined)      $set.price = Number(price);
    if (description !== undefined) $set.description = description;
    if (quantity !== undefined)    $set.quantity = Number(quantity);
    if (colspan !== undefined)     $set.colspan = Number(colspan) === 2 ? 2 : 1;

    if (category_id) {
      const ok = await Category.exists({ _id: category_id, status: "active" });
      if (!ok) return res.status(400).json({ success: false, message: "Invalid category" });
      $set.category_id = category_id;
    }

    // 2) Nếu có files -> replace toàn bộ ảnh
    if (files.length > 0) {
      const current = await Product.findById(id).lean();
      if (!current) return res.status(404).json({ success: false, message: "Product not found" });

      const oldPids = (current.images || []).map(i => i.public_id).filter(Boolean);
      await Promise.all(oldPids.map(pid => cloudinary.uploader.destroy(pid).catch(() => null)));

      const uploadedImages = [];
      for (let i = 0; i < files.length; i++) {
        const up = await cloudinary.uploader.upload(files[i].path, {
          folder: `AetherHouse/products/${name || current.name}`,
        });
        uploadedImages.push({
          url: up.secure_url,
          public_id: up.public_id,
          is_main: i === 0,
        });
      }
      $set.images = uploadedImages;
    }

    // 3) Update
    const updated = await Product.findByIdAndUpdate(
      id,
      { $set },
      { new: true, runValidators: true }
    ).populate("category_id");

    if (!updated) return res.status(404).json({ success: false, message: "Product not found" });

    return res.status(200).json({ success: true, product: updated });
  } catch (error) {
    console.error("updateProduct error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};



const hideProduct  = async (req , res) => {
    try {
    const { id } = req.params; // /products/:id
    const updated = await Product.findByIdAndUpdate(
      id,
      { $set: { is_hidden: true } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, product: updated });
  } catch (err) {
    console.error("hideProduct error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
const unhideProduct  = async (req , res) => {
    try {
    const { id } = req.params; // /products/:id
    const updated = await Product.findByIdAndUpdate(
      id,
      { $set: { is_hidden: false } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, product: updated });
  } catch (err) {
    console.error("hideProduct error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}




module.exports = {
    getall,
    getProductsByParentSlug,
    getProductsByChildSlug,
    getByIDpro,
    addProduct,
    updateProduct,
    hideProduct,
    unhideProduct
}