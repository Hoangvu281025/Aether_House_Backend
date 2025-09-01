const express = require('express');
const router = express.Router();
const multer = require("multer");
const { getStores , addStore , getStoreById, deleteStore } = require('../controllers/storeControllers');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/' , getStores);
router.get('/:id' , getStoreById);
router.post('/',upload.array("images",2),addStore);



router.delete('/:id',deleteStore);
module.exports = router