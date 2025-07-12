const {CloudinaryStorage} = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'profile-pictures',
        allowedFormats: ['jpg', 'png', 'jpeg']
    }
})

module.exports = storage;