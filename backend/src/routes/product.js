var express = require('express');
var router = express.Router();

const ProductControllers = require('../Controllers/productController');
const upload = require('../middlewares/upload');

router.get('/', ProductControllers.getall);
router.get('/by-cate/:parentSlug', ProductControllers.getProductsByParentSlug);
router.get('/by-cate/:parentSlug/:childSlug', ProductControllers.getProductsByChildSlug);
router.get('/by-id/:id', ProductControllers.getByIDpro);


router.post('/',upload.array('images', 2), ProductControllers.addProduct);
router.put('/:id',upload.array('images', 2), ProductControllers.updateProduct);
router.patch('/:id/hide', ProductControllers.hideProduct);
router.patch('/:id/unhide', ProductControllers.unhideProduct);



module.exports = router;
