const multer = require("multer");
const path = require("path");

// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("../mongo/config/cloudinary");

// cấu hình storage
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "AetherHouse",
//   },
// });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;
