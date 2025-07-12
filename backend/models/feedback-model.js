const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    swapId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SwapRequest',
        required: true
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1, max: 5,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Feedback', feedbackSchema);