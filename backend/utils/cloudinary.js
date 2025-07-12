const cloudinary = require("cloudinary").v2;
const debug = require('debug')('backend:cloudinary');

try{
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
    });

    if(
        !process.env.CLOUDINARY_NAME ||
        !process.env.CLOUDINARY_KEY ||
        !process.env.CLOUDINARY_SECRET
    ) {
        throw new Error("Missing Cloudinary credentials");
    }

    debug("Cloudinary connected");
} catch (err) {
    console.error(err);
    throw new Error(
        "Error connecting to Cloudinary. Please check your Cloudinary credentials."
    )
}