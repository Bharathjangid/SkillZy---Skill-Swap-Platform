const express = require("express");
const router = express.Router();
const {
    createFeedback,
    getFeedbackForUser,
    getMyFeedback
} = require("../controllers/feedback-controller");
const auth = require("../middleware/auth");

router.post("/create", auth, createFeedback);
router.get("/user/:id", auth, getFeedbackForUser);
router.get("/my", auth, getMyFeedback);

module.exports = router