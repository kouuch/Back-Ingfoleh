const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { populate } = require('../models/Produk');
const { validateFeedbackInput } = require('../middleware/validationMiddleware');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

// Create feedback (user only)
router.post('/', authenticateToken, authorizeRoles('user', 'admin'), validateFeedbackInput, async (req, res, next) => {
    try {
        const feedback = new Feedback({
            user: req.user.id,
            produk: req.body.produk,
            rating: req.body.rating,
            komentar: req.body.komentar
        })
        await feedback.save()
        logger.info(`Feedback created successfully by user ${req.user.id} for product ${req.body.produk}`)
        res.status(201).json(feedback)
    } catch (error) {
        logger.error(`Error creating feedback: ${error.message}`)
        next(new AppError(error.message, 400))
    }
})


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

// Update feedback (user dan admin)
router.put('/:id', authenticateToken, authorizeRoles('user', 'admin'), validateFeedbackInput, async (req, res, next) => {
    try {
        const feedback = await Feedback.findById(req.params.id)
        if (!feedback) {
            logger.warn(`Feedback with id ${req.params.id} not found`)
            return next(new AppError('Feedback tidak ditemukan', 404))
        }


        //hanya pemilik atau addmin
        if (feedback.user.toString() !== req.user.id && req.user.role !== 'admin') {
            logger.warn(`Access denied: User ${req.user.id} attempted to update feedback ${req.params.id}`)
            return next(new AppError('Akses ditolak: Hanya pemilik atau admin yang dapat mengubah feedback', 403))
            // return res.status(403).json({ msg: 'Akses ditolak: Hanya pemilik atau admin yang dapat mengubah feedback' })
        }

        feedback.rating = req.body.rating ?? feedback.rating
        feedback.komentar = req.body.komentar ?? feedback.komentar
        await feedback.save()
        logger.info(`Feedback updated successfully by user ${req.user.id} for feedback ${req.params.id}`)
        res.json(feedback)
    } catch (error) {
        logger.error(`Error updating feedback: ${error.message}`)
        next(new AppError(error.message, 400))
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