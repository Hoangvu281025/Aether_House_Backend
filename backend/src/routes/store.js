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

router.get("/",middlewares.verifyToken,middlewares.verifyCRUDStore, getAllStores);
router.get("/slug/:slug", getStoreBySlug);
router.get("/:id", getStoreById);

router.post("/",middlewares.verifyToken,middlewares.verifyCRUDStore, upload.single("images"), addStore);

router.put("/:id", updateStore);

router.delete("/:id", deleteStore);

module.exports = router