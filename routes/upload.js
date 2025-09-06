var express = require('express');
var router = express.Router();

const uploadControllers = require('../mongo/Controllers/imageController')

const upload = require('../mongo/middlewares/uploadMiddleware');

router.post('/',upload.array('images' , 2), uploadControllers.uploadimage);

module.exports = router;
