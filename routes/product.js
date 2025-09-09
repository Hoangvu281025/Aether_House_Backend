var express = require('express');
var router = express.Router();
const upload = require('../mongo/middlewares/uploadMiddleware');
const ProductControllers = require('../mongo/Controllers/productController')

router.get('/:parentSlug', ProductControllers.getProductsByParentSlug);


router.post('/',upload.array('images' , 2), ProductControllers.addProduct);
router.put('/:id', ProductControllers.updateProduct);
router.delete('/:id', ProductControllers.deleteProduct);



module.exports = router;
