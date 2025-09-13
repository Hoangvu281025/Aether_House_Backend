var express = require('express');
var router = express.Router();
const UserControllers = require('../Controllers/userController')
// const { uploadUser_clinet } = require('../middlewares/uploadMiddleware');

/* GET users listing. */
router.get('/', UserControllers.login);
// router.post('/registerUser', uploadUser_clinet.single('image'), UserControllers.registerUser);
// router.post('/registerAdmin' ,uploadUser.single('image'), UserControllers.registerAdmin);
router.post('/registerUser', UserControllers.registerUser);
router.post('/registerAdmin' , UserControllers.registerAdmin);

module.exports = router;
