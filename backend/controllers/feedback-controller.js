const feedbackModel = require("../models/feedback-model");
const swapRequestModel = require("../models/swapRequest-model");
const debug = require("debug")("backend:feedback-controller");

module.exports.createFeedback = async (req, res) => {
    try {
        const { swapId, message, rating } = req.body;

        if (!swapId || !message || !rating) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const swap = await swapRequestModel.findById(swapId);

        if (!swap || swap.status !== "accepted") {
            return res.status(400).json({ message: "Invalid swap request" });
        }

        const from = req.user._id;

        if (
            swap.recipient.toString() !== from.toString() &&
            swap.requester.toString() !== from.toString()
        ) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const to = 
            swap.recipient.toString() === from.toString()
                ? swap.requester
                : swap.recipient;

        const existing = await feedbackModel.findOne({
            from,
            to,
            swapId
        });

        if(existing) {
            return res.status(400).json({ message: "Feedback already exists" });
        }

        const feedback = await feedbackModel.create({
            from,
            to,
            swapId,
            message,
            rating
        });

        res.status(201).json(feedback);
    } catch (error) {
        debug("Error creating feedback", error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports.getFeedbackForUser = async (req, res) => {
    try {
        const userId = req.user._id;

        const feedbacks = await feedbackModel.find({ to: userId })
        .sort({ createdAt: -1 })
        .populate("from", "name email")
        .populate('swapId', 'skillOffered skillWanted');
        
        const averageRating = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0) / (feedbacks.length || 1);

        res.status(200).json({ feedbacks, averageRating: averageRating.toFixed(2), count: feedbacks.length });
    } catch (error) {
        debug("Error getting feedback for user", error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports.getMyFeedback = async (req, res) => {
    try {
        const userId = req.user._id;

        const feedbacks = await feedbackModel.find({ from: userId })
        .sort({ createdAt: -1 })
        .populate("to", "name email")
        .populate('swapId', 'skillOffered skillWanted');
        
        res.status(200).json(feedbacks);
    } catch (error) {
        debug("Error getting my feedback", error.message);
        res.status(500).json({ message: error.message });
    }
};