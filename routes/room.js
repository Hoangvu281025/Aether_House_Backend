var express = require('express');
var router = express.Router();
const RoomControllers = require('../mongo/Controllers/roomController')
/* GET home page. */
router.get('/', RoomControllers.getAllRooms);
router.post('/', RoomControllers.addRoom);


module.exports = router;
