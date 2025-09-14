var express = require('express');
var router = express.Router();
const {authController} = require('../Controllers/authController')
// const { uploadUser_clinet } = require('../middlewares/uploadMiddleware');

/* GET users listing. */
router.post('/login', authController.login);
// router.post('/registerUser', uploadUser_clinet.single('image'), UserControllers.registerUser);
// router.post('/registerAdmin' ,uploadUser.single('image'), UserControllers.registerAdmin);
router.post('/registerUser', authController.registerUser);
router.post('/registerAdmin' , authController.registerAdmin);

module.exports = router;
