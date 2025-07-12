const express = require("express");
const router = express.Router();
const {
    getAllUsers,
    getAllFeedback,
    getAllSwaps,
    banUser,
    unbanUser,
    reviewUserSkills
} = require("../controllers/admin-controller");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/users", auth, admin, getAllUsers);
router.get("/feedback", auth, admin, getAllFeedback);
router.get("/swaps", auth, admin, getAllSwaps);
router.put("/ban/:id", auth, admin, banUser);
router.put("/unban/:id", auth, admin, unbanUser);
router.put("/review/:id", auth, admin, reviewUserSkills);

module.exports = router;