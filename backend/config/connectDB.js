const mongoose = require("mongoose");
const debug = require("debug")("backend:db");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/skillzy_test");
    debug(`MongoDB connected: [${conn.connection.name}] ${conn.connection.host}`);
  } catch (error) {
    console.error("Mongo connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

