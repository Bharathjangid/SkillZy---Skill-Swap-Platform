const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const setAuthCookie = require("../utils/setAuthCookie.js");
const debug = require("debug")("backend:auth-controller");

module.exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const isAdmin = process.env.NODE_ENV === 'development' && req.body.isAdmin === true;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await userModel.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      isAdmin,
    });

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    debug("User registered", user.email);
    res.status(201).json({
      message: "User registered successfully",
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    debug(error);
    res
      .status(500)
      .json({ message: "Error registering user. Please try again." });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await userModel.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    debug("User logged in", user.email);
    res.status(200).json({
      message: "User logged in successfully",
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    debug(error);
    res.status(500).json({ message: "Error logging in. Please try again." });
  }
};

module.exports.logoutUser = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
};