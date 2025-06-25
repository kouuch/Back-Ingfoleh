const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');
const User = require('../models/User');


// Endpoint untuk menyimpan feedback
router.post('/feedback', authenticateToken, async (req, res) => {
    const { email, rating, komentar } = req.body;
    const userId = req.user.id;  // Mengambil userId dari req.user yang sudah divalidasi

    try {
        // Cek apakah pengguna ada di database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Simpan feedback
        const newFeedback = new Feedback({
            id_user: userId,
            email,
            rating,
            komentar
        });

        const savedFeedback = await newFeedback.save();

        // Mencari feedback yang disimpan dan populasi foto pengguna
        const feedbackWithUser = await Feedback.findById(savedFeedback._id).populate('id_user', 'profilePicture');

        // Mengirimkan response dengan feedback yang disertakan foto pengguna
        res.status(201).json(feedbackWithUser);
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// API untuk mengambil semua feedback dan mempopulasi data pengguna (id_user) dan produk (id_produk)
// API untuk mengambil semua feedback dan hanya mempopulasi id_user
router.get('/feedbacks', async (req, res) => {
    try {
        // Mengambil semua feedback dan mempopulasi id_user untuk mendapatkan foto profil pengguna
        const feedbacks = await Feedback.find()
            .populate('id_user', 'profilePicture username');  // Hanya mempopulasi data user

        // Cek apakah feedback ada
        if (feedbacks.length === 0) {
            return res.status(404).json({ message: 'No feedbacks found' });
        }

        // Log jumlah feedback yang ditemukan
        logger.info(`Fetched ${feedbacks.length} feedbacks`);

        // Mengirimkan response dengan daftar feedback yang sudah dipopulasi
        res.status(200).json(feedbacks);
    } catch (error) {
        // Log error dan mengirimkan response error
        console.error('Error fetching feedback:', error);  // Log error di console
        logger.error('Error fetching feedback:', error);   // Log error menggunakan logger

        // Mengirimkan response error yang lebih informatif
        res.status(500).json({
            message: 'Gagal mengambil feedback',
            error: error.message  // Kirimkan pesan error yang lebih rinci
        });
    }
});










// read feedback (user dan admin)
router.get('/', authenticateToken, authorizeRoles('admin', 'user'), async (req, res, next) => {
    try {
        const feedbacks = await Feedback.find().populate('user', 'username').populate('produk', 'nama_produk')
        logger.info(`Fetched ${feedbacks.length} feedbacks`)
        res.json(feedbacks)
    } catch (error) {
        logger.error(`Error fetching feedbacks: ${error.message}`)
        next(new AppError(error.message, 500))
    }
})


// Delete feedback (admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res, next) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id)
        if (!feedback) {
            logger.warn(`Feedback with id ${req.params.id} not found`)
            return next(new AppError('Feedback tidak ditemukan', 404))
        }
        res.json({ msg: 'Feedback berhasil dihapus' })
    } catch (error) {
        next(new AppError(error.message, 500))
    }
})


module.exports = router;