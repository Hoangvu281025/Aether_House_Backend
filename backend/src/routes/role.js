var express = require('express');
var router = express.Router();
const RoleControllers = require('../Controllers/roleController')
/* GET home page. */
router.get('/', RoleControllers.getAllrole);
router.post('/', RoleControllers.addrole);

module.exports = router;
