var express = require('express');
var router = express.Router();
const ProductControllers = require('../mongo/Controllers/productController')
const multer = require('multer');
const storage = multer.memoryStorage(); // lưu file tạm vào ram
const upload = multer({ storage });

router.get('/', ProductControllers.getAllProducts);
router.get('/:id', ProductControllers.getByProductID);
router.post('/',upload.array('images' , 2), ProductControllers.addProduct);
router.put('/:id', ProductControllers.updateProduct);
router.delete('/:id', ProductControllers.deleteProduct);



module.exports = router;
