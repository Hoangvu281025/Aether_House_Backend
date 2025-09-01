const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (fileBuffer, folder = "stores") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
    stream.end(fileBuffer);
  });
};

const deleteFromCloudinary = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};
module.exports ={ uploadToCloudinary , deleteFromCloudinary};
