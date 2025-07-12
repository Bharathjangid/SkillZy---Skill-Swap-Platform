const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    logoutUser
} = require('../controllers/auth-controller');
const auth = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', auth, logoutUser);

module.exports = router;