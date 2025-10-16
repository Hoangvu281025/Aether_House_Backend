
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");
const ProductVariant = require("../Models/product_variantModel");
const Product = require("../Models/productModel");
const fs = require("fs/promises");   // để await unlink
const path = require("path");

// const ensureVariantDoc = async (req, res) => {
//   try {
//     const { product_id } = req.body;
//     if (!product_id) {
//       return res
//         .status(400)
//         .json({ success: false, message: "product_id is required" });
//     }

//     const product = await Product.findById(product_id);
//     if (!product) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Product not found" });
//     }

//     let variant = await ProductVariant.findOne({
//       "product_id.productId": product._id,
//     });
//     if (!variant) {
//       variant = await ProductVariant.create({
//         product_id: { productId: product._id },
//         Variation: [],
//       });
//     }

//     return res.json({ success: true, variant });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };







const getVariantByProductId = async (req, res) => {
  try {
   const { productId } = req.params;
    const variant = await ProductVariant.findOne({ product_id: productId });

    if (!variant) {
      return res.json({ success: true, variant: null, Variation: [] });
    }
    return res.json({
      success: true,
      variant,
      Variation: variant.Variation || [],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};











const addVariant = async (req, res) => {
  try {
    const { product_id, color , hex } = req.body;
    const files = req.files || [];

    if (files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    const product = await Product.findById(product_id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

        
  let variant = await ProductVariant.findOne({ product_id: product._id });

    if (!variant) {
      variant = await ProductVariant.create({
        product_id: product._id,
        Variation: [],
      });
    }
    const exists = (variant.Variation || []).some(
      (v) => v.color.toLowerCase() === String(color).toLowerCase()
    );
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: "Color already exists" });
    }

    const uploaded = [];
    for (const file of files) {
      const localPath = path.resolve(file.path);
      try {
        const results = await cloudinary.uploader.upload(localPath, {
          folder: `AetherHouse/products/${product.name}/${color}`,
        });

        uploaded.push({
          url: results.secure_url,
          public_id: results.public_id,
        });

        // ✅ Kiểm tra file tồn tại trước khi xóa
        try {
          await new Promise((r) => setTimeout(r, 150));
            await fs.unlink(localPath);
        } catch {
          console.warn("File tạm không tồn tại:", localPath);
        }
      } catch (err) {
        console.warn("Upload thất bại:", err.message);
      }
    }
    // fs.unlink(file.path, () => {});

    variant.Variation.push({
      color,
      images: uploaded,               
      hex: (hex || "").trim(),
    });
    await variant.save();
    return res.status(201).json({ success: true, variant });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};





const updateVariant = async (req, res) => {
  try { 
    const { productId, colorId } = req.params;
    const {color, hex , images} = req.body;
    const files = req.files || [];
    
    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(colorId))
      return res.status(400).json({ success: false, message: "Invalid ids" });

    const doc = await ProductVariant.findOne({ product_id: productId });
    if (!doc) return res.status(404).json({ success: false, message: "Variant not found" });

    const item = doc.Variation.id(colorId);
    if (!item) return res.status(404).json({ success: false, message: "Color not found" });


  // đổi tên màu
    if (typeof color !== 'undefined' && color.trim()) { 
      const newColor = color.trim();
      // tránh trùng tên
      const dup = doc.Variation.some(v =>
        String(v._id) !== String(colorId) &&
        v.color.trim().toLowerCase() === newColor.toLowerCase()
      );      
      if (dup) return res.status(409).json({ success: false, message: "Color already exists" });  
      item.color = newColor;
  } 

  // đổi hex

  if (typeof hex !== "undefined") {
      const h = String(hex || "").trim();
      if (h && !/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(h))
        return res.status(400).json({ success: false, message: "Invalid hex color" });
      item.hex = h;
    }
    doc.markModified('Variation');        
    await doc.save();
    
    return res.json({ success: true, updatedColor: item, variant: doc });
  }catch (err) {
    console.error("[updateVariant]",err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


const updateSingleImage = async (req, res) => {
  try {
    const { productId, colorId, imageId } = req.params;
    const file = req.file;
    if (!file) return res.status(400).json({ message: "Image file is required" });

    const doc = await ProductVariant.findOne({ product_id: productId });
    if (!doc) return res.status(404).json({ message: "Variant not found" });

    const product = await Product.findById(productId).select("name slug");
    if (!product) return res.status(404).json({ message: "Product not found" });

    const item = doc.Variation.id(colorId);
    if (!item) return res.status(404).json({ message: "Color not found" });

    const imgItem = item.images.id(imageId);
    if (!imgItem) return res.status(404).json({ message: "Image not found" });

    // chuẩn hoá đường dẫn file tạm
    const localPath = path.resolve(file.path);

    let r;
    try {
      // Upload ảnh mới
      r = await cloudinary.uploader.upload(localPath, {
        folder: `AetherHouse/products/${product.name}/${item.color || item.name || colorId}`,
      });

      // Xoá ảnh cũ trên Cloudinary (nếu có)
      if (imgItem.public_id) {
        try { await cloudinary.uploader.destroy(imgItem.public_id); } catch (_) {}
      }

      // Cập nhật doc
      imgItem.url = r.secure_url;
      imgItem.public_id = r.public_id;
      await doc.save();
    } finally {
      // Luôn cố xoá file tạm, kể cả upload fail
      try {
        await new Promise((resv) => setTimeout(resv, 150)); // tránh file bị lock (Windows)
        await fs.unlink(localPath);
        // console.log("Deleted temp:", localPath);
      } catch (e) {
        console.error("❌ Unlink failed:", localPath, e);
      }
    }

    return res.json({ success: true, updatedImage: imgItem });
  } catch (err) {
    console.error("[updateSingleImage]", err);
    return res.status(500).json({ message: "Server error" });
  }
};





const deleteVariant = async (req, res) => {
  try {
    const { productId, colorId } = req.params;

    const variant = await ProductVariant.findOne({ product_id: productId });
    if (!variant) {
      return res.status(404).json({ success: false, message: "Variant not found" });
    }

    const item = variant.Variation.id(colorId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Color not found" });
    }

    // 🟩 Lấy thông tin để biết thư mục Cloudinary cần xoá
    const product = await Product.findById(productId);
    const folderPath = `AetherHouse/products/${product.name}/${item.color}`;

    // ✅ Xóa toàn bộ ảnh theo prefix (thư mục)
    try {
      await cloudinary.api.delete_resources_by_prefix(folderPath);
      console.log("Đã xoá toàn bộ ảnh trong:", folderPath);
    } catch (err) {
      console.warn("Không thể xóa resources by prefix:", err.message);
    }

    // ✅ Sau đó xóa luôn folder
    try {
      await cloudinary.api.delete_folder(folderPath);
      console.log("Đã xoá folder:", folderPath);
    } catch (err) {
      console.warn("Không thể xoá folder:", err.message);
    }

    // ✅ Xóa variant trong MongoDB
    variant.Variation.pull(colorId);
    await variant.save();

    return res.json({ success: true, message: "Color and folder deleted successfully" });
  } catch (err) {
    console.error("[deleteVariant]", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};





const getAllColors = async (req, res) => {
  try {
    const docs = await ProductVariant.find({}).select('product_id Variation').lean();

    const colorMap = new Map(); 
    docs.forEach(v => {
      const pid = String(v.product_id);
      (v.Variation || []).forEach(vi => {
        const label = (vi.color || '').trim();
        if (!label) return;
        const key = label.toLowerCase();
        if (!colorMap.has(key)) colorMap.set(key, { label, productIds: new Set() });
        colorMap.get(key).productIds.add(pid);
      });
    });

    const colors = [...colorMap.values()]
      .map(x => ({ label: x.label, value: x.label, count: x.productIds.size }))
      .sort((a, b) => a.label.localeCompare(b.label));

    res.json({ success: true, colors });
  } catch (err) {
    console.error('[getAllColors]', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


module.exports = {
  getVariantByProductId,
  addVariant,
  updateVariant,
  updateSingleImage,
  deleteVariant,
  getAllColors,

};
