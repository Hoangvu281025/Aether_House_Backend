var express = require('express');
var router = express.Router();
const UserControllers = require('../Controllers/userController')
const upload = require('../middlewares/uploadMiddleware');
/* GET users listing. */
router.get('/', UserControllers.login);
router.post('/registerUser',upload.single('image'), UserControllers.registerUser);
router.post('/registerAdmin',upload.single('image'), UserControllers.registerAdmin);

module.exports = router;
