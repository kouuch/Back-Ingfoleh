const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    produk: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'produk',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    komentar: {
        type: String
    },
    tanggal_review : {
        type: Date,
        default: Date.now
    }
},{ timestamps: true})

module.exports = mongoose.model('Feedback', feedbackSchema);