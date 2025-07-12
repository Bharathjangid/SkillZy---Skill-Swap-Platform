const userModel = require("../models/user-model");
const debug = require("debug")("backend:user-controller");

module.exports.getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).select("-password");
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        debug("Error getting user profile", error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports.updateProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updates = req.body;

    if (updates.email && updates.email !== user.email) {
      const emailExists = await userModel.findOne({ email: updates.email });
      if (emailExists) {
        return res.status(409).json({ message: "Email already in use by another user." });
      }
    }

const restrictedFields = ['isAdmin', 'isBanned'];

Object.keys(updates).forEach((key) => {
  if (!restrictedFields.includes(key) && key !== 'password') {
    user[key] = updates[key];
  }
});


    await user.save();
    res.json(user);
  } catch (error) {
    debug("Error updating user profile", error.message);
    res.status(500).json({ message: error.message });
  }
};


module.exports.deleteUser = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.user._id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        debug("Error deleting user", error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports.changePassword = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { currentPassword, newPassword } = req.body;

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid current password" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password changed successfully" });
    } catch (error) {
        debug("Error changing password", error.message);
        res.status(500).json({ message: error.message });
    }
};