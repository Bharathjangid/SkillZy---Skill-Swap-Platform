const mongoose = require('mongoose');

const swapRequestSchmea = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    skillOffered: {
        type: String,
        required: true
    },
    skillWanted: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum : ['pending', 'accepted', 'rejected', 'cancelled'],
        default: 'pending'
    },
    message: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SwapRequest', swapRequestSchmea);