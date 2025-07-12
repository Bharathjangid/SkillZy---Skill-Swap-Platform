const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateProfile,
    changePassword,
    deleteUser
} = require('../controllers/user-controller');
const auth = require('../middleware/auth');

router.get('/profile', auth, getUserProfile);
router.put('/profile/update', auth, updateProfile);
router.put('/password', auth, changePassword);
router.delete('/profile', auth, deleteUser);

module.exports = router;