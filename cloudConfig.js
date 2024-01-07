const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.cloud_name,
    api_key:process.env.cloud_api_key,
    api_secret:process.env.cloud_api_secret,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedFormats:["png","jpg","jpeg"],
    },
});

module.exports={
    cloudinary,
    storage,
};