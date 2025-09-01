const express = require('express');
const router = express.Router();
// const upload = require('../middlewares/upload');
const { getStores , addStore } = require('../controllers/storeControllers');


router.get('/' , getStores);
router.post('/',addStore);
module.exports = router