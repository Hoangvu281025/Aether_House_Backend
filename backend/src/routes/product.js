var express = require('express');
var router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const ProductControllers = require('../Controllers/productController')

router.get('/by-cate/:parentSlug', ProductControllers.getProductsByParentSlug);
router.get('/by-cate/:parentSlug/:childSlug', ProductControllers.getProductsByChildSlug);
router.get('/by-id/:id', ProductControllers.getByIDpro);


router.post('/',upload.array('images' , 2), ProductControllers.addProduct);
router.put('/:id', ProductControllers.updateProduct);
router.delete('/:id', ProductControllers.deleteProduct);



module.exports = router;
