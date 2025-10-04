// middlewares/upload.js
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // lưu tạm vào /uploads
module.exports = upload;
