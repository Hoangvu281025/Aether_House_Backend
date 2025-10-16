var express = require('express');
var router = express.Router();

const ProductControllers = require('../Controllers/productController');
const upload = require('../middlewares/upload');
const  middlewares  = require('../middlewares/middlewares');



router.get('/', ProductControllers.getall);
router.get('/by-cate/:parentSlug', ProductControllers.getProductsByParentSlug);
router.get('/by-cate/:parentSlug/:childSlug', ProductControllers.getProductsByChildSlug);
router.get('/by-id/:id', ProductControllers.getByIDpro);
router.get('/by-color/:color', ProductControllers.getProductsByColor);


router.post('/',middlewares.verifyToken , middlewares.verifyCRUDProduct ,upload.array('images', 2), ProductControllers.addProduct);
router.put('/:id',middlewares.verifyToken , middlewares.verifyCRUDProduct,upload.array('images', 2), ProductControllers.updateProduct);
router.patch('/:id/hide',middlewares.verifyToken , middlewares.verifyCRUDProduct, ProductControllers.hideProduct);
router.patch('/:id/unhide',middlewares.verifyToken , middlewares.verifyCRUDProduct, ProductControllers.unhideProduct);



module.exports = router;
