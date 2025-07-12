const express = require("express");
const router = express.Router();
const {
    searchUsers
} = require("../controllers/search-controller");
const auth = require("../middleware/auth");
const {getAutoComplete} = require("../controllers/autoComplete-controller");

router.post("/search", auth, searchUsers);
router.get("/autoComplete", auth, getAutoComplete);

module.exports = router;