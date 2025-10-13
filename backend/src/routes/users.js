var express = require('express');
var router = express.Router();
const { userController } = require('../Controllers/userController')
const  middlewares  = require('../middlewares/middlewares');

const upload = require('../middlewares/upload')
// const { uploadUser_clinet } = require('../middlewares/uploadMiddleware');

/* GET users listing. */
router.get('/count', userController.countUsers);
router.get('/' ,middlewares.verifyToken,userController.getallUser); //middlewares.verifyCRUDUser,
router.get('/admins',middlewares.verifyToken, userController.getallAdmin);
router.get('/:id', userController.getbyID);
router.put('/:id/disabledAdmin',middlewares.verifyToken,middlewares.verifyCRUDAdmin, userController.toggleActive);
router.put('/:id/disabledUser',middlewares.verifyToken,middlewares.verifyCRUDUser, userController.toggleActive);
router.put('/:id/avataradmin',middlewares.verifyToken ,upload.single("avatar"), userController.updateImageAdmin);
router.put('/:id/avataruser',middlewares.verifyToken ,upload.single("avatar"), userController.updateImageUser);
router.put('/:id/infor',middlewares.verifyToken , userController.updateinfor);


router.post('/:id/modules', userController.addModule);


// sửa/ghi đè danh sách quyền
router.put('/:id/modules', userController.updateModules);

module.exports = router;
