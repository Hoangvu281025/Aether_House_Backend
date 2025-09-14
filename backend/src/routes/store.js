const express = require("express");
const router = express.Router();
const multer = require("multer");
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
router.get("/", getAllStores);
router.get("/:id", getStoreById);
router.post("/", upload.array("images", 2), addStore);   // Thêm store (tối đa 2 ảnh)
router.put("/:id", upload.array("images", 2), updateStore);
router.delete("/:id", deleteStore);

module.exports = router;
