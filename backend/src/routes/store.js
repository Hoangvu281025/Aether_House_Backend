const express = require("express");
const router = express.Router();
const { uploadStores } = require('../middlewares/uploadMiddleware');

const { 
  getAllStores,
  getStoreById,
  getStoreBySlug,
  addStore,
  updateStore,
  deleteStore
} = require("../Controllers/storeController");

router.get("/", getAllStores);
router.get("/slug/:slug", getStoreBySlug);
router.get("/:id", getStoreById);

router.post("/", uploadStores.single("images"), addStore);

router.put("/:id", updateStore);

router.delete("/:id", deleteStore);

module.exports = router