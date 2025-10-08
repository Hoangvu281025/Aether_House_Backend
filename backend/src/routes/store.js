const express = require("express");
const router = express.Router();
const upload = require('../middlewares/upload');

const { 
  getAllStores,
  getStoreById,
  getStoreBySlug,
  addStore,
  updateStore,
  deleteStore
} = require("../Controllers/storeController");
const  middlewares  = require('../middlewares/middlewares');

router.get("/", getAllStores);
router.get("/slug/:slug", getStoreBySlug);
router.get("/:id", getStoreById);

router.post("/",middlewares.verifyToken,middlewares.verifyCRUDStore, upload.single("image"), addStore);

router.put("/:id",middlewares.verifyToken,middlewares.verifyCRUDStore,upload.single('image'), updateStore);

router.delete("/:id",middlewares.verifyToken,middlewares.verifyCRUDStore, deleteStore);

module.exports = router