const express = require("express");
const router = express.Router();
const multer = require("multer");
const  middlewares  = require('../middlewares/middlewares');
const { uploadStores } = require('../middlewares/uploadMiddleware');

const { 
  getAllStores,
  getStoreById,
  addStore,
  updateStore,
  deleteStore
} = require("../Controllers/storeController");

// Cấu hình multer để upload file tạm
const upload = multer({ dest: "uploads/" });

// Routes
router.get("/",middlewares.verifyToken, getAllStores);
router.get("/:id", getStoreById);
router.post("/", uploadStores.single("image"), addStore);
router.put("/:id", uploadStores.single("image"), updateStore);
router.delete("/:id", deleteStore);

module.exports = router;
