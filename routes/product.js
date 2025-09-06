var express = require('express');
var router = express.Router();
const ProductControllers = require('../mongo/Controllers/productController')
const validateProduct = require('../mongo/middlewares/validateProduct');

router.get('/', ProductControllers.getAllProducts);
router.get('/:id', ProductControllers.getByProductID);
router.get('/:slug', ProductControllers.getByProductSlug);
router.post('/', validateProduct, ProductControllers.addProduct);
router.put('/:id', ProductControllers.updateProduct);
router.delete('/:id', ProductControllers.deleteProduct);



module.exports = router;
