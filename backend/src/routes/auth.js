var express = require('express');
var router = express.Router();
const {authController} = require('../Controllers/authController')
const  middlewares  = require('../middlewares/middlewares');


/* GET users listing. */
router.post('/login-admin', authController.loginAdmin);
router.post('/login-client', authController.loginClient);
router.post('/verify', authController.verifyOtp);
router.post('/logout',middlewares.verifyToken, authController.logout);
// router.post('/registerUser', uploadUser_clinet.single('image'), UserControllers.registerUser);
// router.post('/registerAdmin' ,uploadUser.single('image'), UserControllers.registerAdmin);
// router.post('/registerUser', authController.registerUser);
// router.post('/registerAdmin' , authController.registerAdmin);

module.exports = router;
