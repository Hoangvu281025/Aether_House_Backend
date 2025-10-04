var express = require('express');
var router = express.Router();
const { addressController } = require('../Controllers/addressController')
// const  middlewares  = require('../middlewares/middlewares');

// const { uploadUser_clinet } = require('../middlewares/uploadMiddleware');

/* GET users listing. */
router.post('/', addressController.addAddress);
router.put('/:id/upaddress', addressController.updateAddress);



module.exports = router;
