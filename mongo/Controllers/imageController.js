const cloudinary = require('../config/cloudinary');
const Product = require('../Models/productModel');


const uploadimage = async (req, res) => {
    try {
        const  productId  = req.body.productId || req.body.productID;
        // console.log(productId);
        if(!productId) return res.status(400).json({ error: 'Product ID should not be provided' });

        const product = await Product.findById(productId);
        // console.log("Found product:", product);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        const files = req.files || [];
        if (files.length === 0) return res.status(400).json({ error: 'No files uploaded' });

        const uploadedImages = [];
        for (let i= 0; i < files.length; i++) {
            const file = files[i];
            const localPath = file.path;
            const results = await cloudinary.uploader.upload(localPath, { folder: 'AetherHouse' });
            uploadedImages.push({
                url: results.secure_url,
                public_id: results.public_id,
                localPath: localPath,
                is_main: i === 0
            });
        }
        product.images = uploadedImages;
        await product.save();
        return res.status(200).json({ message: 'Images uploaded successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {uploadimage}
