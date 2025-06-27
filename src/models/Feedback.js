const mongoose = require('mongoose');
const User = require('./User');

const feedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    emailInput: {
        type: String,  
        required: true
    },
    rating: {
        type: Number,   
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,   
        required: true
    },
    tanggal_review: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

module.exports = mongoose.model('Feedback', feedbackSchema);
