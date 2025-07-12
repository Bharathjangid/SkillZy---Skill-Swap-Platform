const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/user-model");
const debug = require("debug")("backend:admin");

module.exports = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found. Please login again." });
        }

        if (user.isAdmin !== true) {
            return res.status(403).json({ message: "Access denied. Only admins can perform this action." });
        }

        req.user = user;
        next();
    } catch (error) {
        debug("JWT Auth Error", error.message);
        res.status(401).json({ message: "Unauthorized" });
    }
};