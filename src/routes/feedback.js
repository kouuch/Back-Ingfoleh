const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Feedback = require('../models/Feedback');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');
const upload = require('../utils/upload'); 

// Endpoint untuk menyimpan feedback
router.post('/feedback', authenticateToken, async (req, res) => {
    const { email, rating, komentar } = req.body;
    const userId = req.user.id;  

    try {
        const user = await User.findById(userId);
        if (!user) {
            logger.error(`User with id ${userId} not found`);  
            return res.status(404).json({ message: 'User not found' });
        }

        
        const newFeedback = new Feedback({
            id_user: userId,
            email,
            rating,
            komentar
        });

        const savedFeedback = await newFeedback.save();

        
        const feedbackWithUser = await Feedback.findById(savedFeedback._id)
            .populate('id_user', 'profilePicture username email');
        logger .info(`Feedback saved successfully for user ${userId}:`, feedbackWithUser);
        res.status(201).json(feedbackWithUser);
    } catch (error) {
        logger.error(`Error saving feedback for user ${userId}:`, error);  
        console.error('Error saving feedback:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});



// Mengambil produk beserta nama kategori
router.get('/feedbacksecho', async (req, res, next) => {
    try {
        console.log('Fetching all feedbacks');  

        const feedbacks = await Feedback.find()
            .populate('id_user', 'profilePicture username');

        console.log('Feedbacks found:', feedbacks);  

        if (!feedbacks || feedbacks.length === 0) {
            console.error("No feedbacks found");
            return res.status(404).json({ message: 'No feedbacks found' });
        }

        res.status(200).json(feedbacks); 
    } catch (error) {
        console.error('Error fetching feedbacks:', error);  

        res.status(500).json({
            message: 'Failed to fetch feedbacks',
            error: error.message  
        });
    }
});




// Endpoint untuk memperbarui feedback berdasarkan ID
router.put('/feedback/:id', authenticateToken, async (req, res) => {
    const { email, rating, komentar } = req.body;
    const userId = req.user.id;  
    try {

        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback tidak ditemukan' });
        }

        if (feedback.id_user.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Tidak diizinkan untuk mengedit feedback ini' });
        }

        feedback.email = email || feedback.email;
        feedback.rating = rating || feedback.rating;
        feedback.komentar = komentar || feedback.komentar;

        const updatedFeedback = await feedback.save();
        const populatedFeedback = await Feedback.findById(updatedFeedback._id).populate('id_user', 'profilePicture username');

        res.status(200).json(populatedFeedback);  
    } catch (error) {
        console.error('Error updating feedback:', error);
        res.status(500).json({
            message: 'Gagal memperbarui feedback',
            error: error.message,
            stack: error.stack  
        });
    }
});

// Endpoint untuk mendapatkan feedback berdasarkan ID
router.get('/feedback/:id', async (req, res) => {
    try {
        console.log('Fetching feedback with id:', req.params.id);

        const feedback = await Feedback.findById(req.params.id)
            .populate('id_user', 'profilePicture username'); 

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        res.status(200).json(feedback); 
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({
            message: 'Failed to fetch feedback',
            error: error.message,
            stack: error.stack 
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