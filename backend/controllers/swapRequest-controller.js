const SwapRequestModel = require("../models/swapRequest-model");
const debug = require("debug")("backend:swapRequest-controller");

module.exports.createSwapRequest = async (req, res) => {
  try {
    const { recipientId, skillOffered, skillWanted, message } = req.body;

    if (!recipientId || !skillOffered || !skillWanted) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (recipientId === req.user._id) {
      return res.status(400).json({ message: "You cannot swap with yourself" });
    }

    const existing = await SwapRequestModel.findOne({
      requester: req.user._id,
      recipient: recipientId,
      skillOffered,
      skillWanted,
      status: "pending",
    });

    if (existing) {
      return res.status(400).json({ message: "Swap request already exists" });
    }

    const swapRequest = await SwapRequestModel.create({
      requester: req.user._id,
      recipient: recipientId,
      skillOffered,
      skillWanted,
      message,
    });

    res.status(201).json(swapRequest);
  } catch (error) {
    debug("Error creating swap request", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports.getMySwaps = async (req, res) => {
  try {
    const userId = req.user._id;

    const outgoing = await SwapRequestModel.find({ requester: userId })
      .populate("recipient", "name email")
      .sort({ createdAt: -1 });
    const incoming = await SwapRequestModel.find({ recipient: userId })
      .populate("requester", "name email")
      .sort({ createdAt: -1 });

    if (outgoing.length === 0 && incoming.length === 0) {
      return res.status(404).json({ message: "No swaps found" });
    }

    res.status(200).json({ outgoing, incoming });
  } catch (error) {
    debug("Error getting my swaps", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports.updateSwapRequest = async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const swapRequest = await SwapRequestModel.findById(id);

    if (!swapRequest) {
      return res.status(404).json({ message: "Swap request not found" });
    }

    if (!["accepted", "rejected", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const userId = req.user._id;

    if (
      (status === "cancelled" && swapRequest.requester !== userId) ||
      (["accepted", "rejected"].includes(status) &&
        swapRequest.recipient !== userId) ||
      req.user.role !== "admin"
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    swapRequest.status = status;
    await swapRequest.save();

    res.json({ message: `Swap request ${status} successfully` });
  } catch (error) {
    debug("Error updating swap request", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports.deleteSwap = async (req, res) => {
  try {
    const swap = await SwapRequestModel.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({ message: "Swap request not found" });
    }

    if (swap.status !== "pending" && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only pending swaps can be deleted",
      });
    }

    if (
      swap.requester.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You can only delete your own swap requests",
      });
    }

    await swap.deleteOne();
  } catch (error) {
    debug("Error deleting swap request", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports.getSwapById = async (req, res) => {
  try {
    const swap = await SwapRequestModel.findById(req.params.id)
      .populate("requester", "name email")
      .populate("recipient", "name email");

    if (!swap) {
      return res.status(404).json({ message: "Swap request not found" });
    }

    res.status(200).json(swap);
  } catch (error) {
    debug("Error getting swap by id", error.message);
    res.status(500).json({ message: error.message });
  }
};
