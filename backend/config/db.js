const mongoose = require('mongoose');
const debug = require('debug')('backend:db');

module.exports.connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);

        debug(`MongoDB connected: [${process.env.NODE_ENV}] ${conn.connection.host}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}