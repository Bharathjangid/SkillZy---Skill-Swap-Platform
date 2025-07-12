const userModel = require("../models/user-model");
const feedbackModel = require("../models/feedback-model");
const swapRequestModel = require("../models/swapRequest-model");
const debug = require("debug")("backend:admin-controller");

module.exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json(users);
    } catch (error) {
        debug("Error getting all users", error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports.banUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user || user.isBanned) {
            return res.status(404).json({ message: "User not found or already banned." });
        }

        user.isBanned = true;
        await user.save();

        res.status(200).json({ message: "User banned successfully." });    
    } catch (error) {
        debug("Error banning user", error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports.unbanUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user || !user.isBanned) {
            return res.status(404).json({ message: "User not found or not banned." });
        }

        user.isBanned = false;
        await user.save();

        res.status(200).json({ message: "User unbanned successfully.", user: user.email });    
    } catch (error) {
        debug("Error unbanning user", error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports.reviewUserSkills = async (req, res) => {
  try {
    const { skillsWanted, skillsOffered, bio } = req.body;
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (skillsWanted) user.skillsWanted = skillsWanted;
    if (skillsOffered) user.skillsOffered = skillsOffered;
    if (bio) user.bio = bio;

    await user.save();
    res.json({ message: "User skill info updated by admin." });
  } catch (err) {
    debug("Review skills error:", err.message);
    res.status(500).json({ message: "Failed to update skills." });
  }
};

module.exports.getAllFeedback = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const [feedbacks, total] = await Promise.all([
      feedbackModel.find()
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 })
        .populate("from", "name email")
        .populate("to", "name email")
        .populate("swapId", "skillOffered skillWanted"),
      feedbackModel.countDocuments(),
    ]);

    res.json({
      total,
      page: Number(page),
      feedbacks,
    });
  } catch (err) {
    debug("Error getting feedback:", err.message);
    res.status(500).json({ message: "Failed to fetch feedback." });
  }
}


module.exports.getAllSwaps = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const [swaps, total] = await Promise.all([
      SwapRequestModel.find()
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 })
        .populate("requester", "name email")
        .populate("recipient", "name email"),
      SwapRequestModel.countDocuments(),
    ]);

    res.json({ total, page: Number(page), swaps });
  } catch (error) {
    debug("Error getting all swaps", error.message);
    res.status(500).json({ message: error.message });
  }
};