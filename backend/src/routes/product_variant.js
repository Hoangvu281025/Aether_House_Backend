var express = require('express');
var router = express.Router();
const upload = require('../middlewares/upload');
const ProductVariantControllers = require('../Controllers/product_varientController')

router.post('/add',upload.array('images', 10), ProductVariantControllers.addVariant);
router.put("/by-product/:productId/colors/:colorId", ProductVariantControllers.updateVariant);
router.put('/:productId/colors/:colorId/image/:imageId',upload.single('image'),ProductVariantControllers.updateSingleImage);
router.get('/by-product/:productId', ProductVariantControllers.getVariantByProductId);
router.delete("/by-product/:productId/colors/:colorId", ProductVariantControllers.deleteVariant);
module.exports = router;
