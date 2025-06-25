const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    komentar: {
        type: String,
        required: true
    },
    tanggal_review: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true, collection: 'feedbacks' });  // Tentukan koleksi dengan nama 'feedbacks'

module.exports = mongoose.model('Feedback', feedbackSchema);
