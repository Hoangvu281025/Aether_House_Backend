var express = require('express');
var router = express.Router();
const { userController } = require('../Controllers/userController')
const  middlewares  = require('../middlewares/middlewares');
const { uploadUser_admin } = require('../middlewares/uploadMiddleware');
// const { uploadUser_clinet } = require('../middlewares/uploadMiddleware');

/* GET users listing. */
router.get('/', userController.getallUser);
router.get('/admins', userController.getallAdmin);
router.get('/:id', userController.getbyID);
router.delete('/:id',middlewares.verifyTokenDelete);
router.put('/:id/approve',middlewares.verifyToken , userController.updateApprovalStatusUser);
router.put('/:id/avatar',uploadUser_admin.single("avatar"), userController.updateImageAdmin);
// router.post('/registerUser', uploadUser_clinet.single('image'), UserControllers.registerUser);
// router.post('/registerAdmin' ,uploadUser.single('image'), UserControllers.registerAdmin);
// router.post('/registerUser', UserControllers.registerUser);
// router.post('/registerAdmin' , UserControllers.registerAdmin);

module.exports = router;
