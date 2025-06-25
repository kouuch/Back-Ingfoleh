const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');
const User = require('../models/User');
const Feedback = require('../models/Feedback');


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
        const feedbackWithUser = await Feedback.findById(savedFeedback._id)
            .populate('id_user', 'profilePicture username email');

        // Mengirimkan response dengan feedback yang disertakan foto pengguna
        res.status(201).json(feedbackWithUser);
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


// Endpoint untuk mendapatkan semua feedback dan mem-populasi id_user
// Backend: Menangani API GET feedback
router.get('/feedbacks', authenticateToken, async (req, res) => {
    try {
        console.log('Fetching all feedbacks');  // Tambahkan log untuk memastikan bahwa permintaan sampai ke server

        const feedbacks = await Feedback.find()
            .populate('id_user', 'profilePicture username');

        console.log('Feedbacks found:', feedbacks);  // Log hasil pencarian feedbacks

        if (!feedbacks || feedbacks.length === 0) {
            console.error("No feedbacks found");
            return res.status(404).json({ message: 'No feedbacks found' });
        }

        res.status(200).json(feedbacks); // Mengirimkan daftar feedback yang ditemukan
    } catch (error) {
        console.error('Error fetching feedbacks:', error);  // Log error secara detail

        res.status(500).json({
            message: 'Failed to fetch feedbacks',
            error: error.message  // Kirimkan pesan error untuk analisis lebih lanjut
        });
    }
});




// Endpoint untuk memperbarui feedback berdasarkan ID
router.put('/feedback/:id', authenticateToken, async (req, res) => {
    const { email, rating, komentar } = req.body;
    const userId = req.user.id;  // Mendapatkan userId dari token yang sudah terautentikasi

    try {
        // Mencari feedback berdasarkan ID
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback tidak ditemukan' });
        }

        // Memastikan feedback hanya dapat diperbarui oleh pemilik atau admin
        if (feedback.id_user.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Tidak diizinkan untuk mengedit feedback ini' });
        }

        // Memperbarui data feedback
        feedback.email = email || feedback.email;
        feedback.rating = rating || feedback.rating;
        feedback.komentar = komentar || feedback.komentar;

        // Simpan perubahan
        const updatedFeedback = await feedback.save();

        // Populasi id_user untuk mendapatkan data pengguna yang sudah diperbarui
        const populatedFeedback = await Feedback.findById(updatedFeedback._id).populate('id_user', 'profilePicture username');

        res.status(200).json(populatedFeedback);  // Kirimkan data feedback yang sudah diperbarui
    } catch (error) {
        console.error('Error updating feedback:', error);
        res.status(500).json({
            message: 'Gagal memperbarui feedback',
            error: error.message,
            stack: error.stack  // Mengirimkan stack trace untuk membantu debugging
        });
    }
});

// Endpoint untuk mendapatkan feedback berdasarkan ID
router.get('/feedback/:id', async (req, res) => {
    try {
        console.log('Fetching feedback with id:', req.params.id);

        // Mengambil feedback berdasarkan ID
        const feedback = await Feedback.findById(req.params.id)
            .populate('id_user', 'profilePicture username'); // Mem-populasi id_user untuk mengambil data pengguna

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        res.status(200).json(feedback); // Mengirimkan data feedback yang ditemukan
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({
            message: 'Failed to fetch feedback',
            error: error.message,
            stack: error.stack // Menyertakan stack trace untuk debugging lebih lanjut
        });
    }
});








// read feedback (user dan admin)
router.get('/test', authenticateToken, authorizeRoles('admin', 'user'), async (req, res, next) => {
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