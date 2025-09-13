var express = require('express');
var router = express.Router();
const { uploadProducts } = require('../middlewares/uploadMiddleware');
const ProductControllers = require('../Controllers/productController')

router.get('/by-cate/:parentSlug', ProductControllers.getProductsByParentSlug);
router.get('/by-cate/:parentSlug/:childSlug', ProductControllers.getProductsByChildSlug);
router.get('/by-id/:id', ProductControllers.getByIDpro);


router.post('/',uploadProducts.array('images', 10), ProductControllers.addProduct);
router.put('/:id', ProductControllers.updateProduct);
router.delete('/:id', ProductControllers.deleteProduct);



module.exports = router;
