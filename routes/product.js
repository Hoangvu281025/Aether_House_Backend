var express = require('express');
var router = express.Router();
const ProductControllers = require('../mongo/Controllers/productController')


router.get('/', ProductControllers.getAllProducts);
router.get('/:id', ProductControllers.getByProductID);
router.post('/', ProductControllers.addProduct);
router.put('/:id', ProductControllers.updateProduct);
router.delete('/:id', ProductControllers.deleteProduct);



module.exports = router;
