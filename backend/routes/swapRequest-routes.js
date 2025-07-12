const express = require('express');
const router = express.Router();
const {
    createSwapRequest,
    getAllSwaps,
    updateSwapRequest,
    deleteSwap,
    getMySwaps
} = require('../controllers/swapRequest-controller');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/my', auth, getMySwaps);
router.post('/create', auth, createSwapRequest);
router.put('/update', auth, updateSwapRequest);
router.delete('/delete/:id', auth, admin, deleteSwap);

module.exports = router;