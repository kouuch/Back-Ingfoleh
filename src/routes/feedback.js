const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const Feedback = require('../models/Feedback');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

// Route untuk menambahkan feedback
router.post('/feedback', authenticateToken, async (req, res, next) => {
    try {
        const { emailInput, rating, comment } = req.body;  


        if (!emailInput || !rating || !comment) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const user = req.user; 


        const newFeedback = new Feedback({
            userId: user.id,                
            emailInput,                    
            rating,                        
            comment                        
        });


        await newFeedback.save();

        res.status(201).json({ message: 'Feedback submitted successfully!' });
    } catch (error) {
        console.error('Error saving feedback:', error);
        next(error); 
    }
});


// Route untuk mendapatkan feedback
router.get('/feedbacks', async (req, res, next) => {
    try {
        const feedbacks = await Feedback.find().populate('user', 'username email profilePicture'); // Populate data pengguna

        res.json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        next(error);
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