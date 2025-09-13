// upload.js
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const ensure = (dir) => { fs.mkdirSync(dir, { recursive: true }); return dir; };

// storage cho products
const storageProduct = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = ensure(path.join(process.cwd(), 'uploads', 'products'));
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`);
  }
});

// storage cho stores
const storageStore = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = ensure(path.join(process.cwd(), 'uploads', 'stores'));
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`);
  }
});
const storageUser_client = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/users/client/'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});
const storageUser_admin = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/users/admin/'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const uploadProducts = multer({ storage: storageProduct });
const uploadStores   = multer({ storage: storageStore });
const uploadUser_clinet  = multer({ storage: storageUser_client });
const uploadUser_admin   = multer({ storage: storageUser_admin });

module.exports = { uploadProducts, uploadStores , uploadUser_clinet , uploadUser_admin };
