const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { populate } = require('../models/Produk');

// Create feedback (user only)
router.post('/', authenticateToken, authorizeRoles('user', 'admin'), async (req, res) => {
    try {
        const feedback = new Feedback({
            user: req.user.id,
            produk: req.body.produk,
            rating: req.body.rating,
            komentar: req.body.komentar
        })
        await feedback.save()
        res.status(201).json(feedback)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})


// read feedback (user dan admin)
router.get('/', authenticateToken, authorizeRoles('admin', 'user'), async (req, res) => {
    try {
        const feedbacks = await Feedback.find().populate('user', 'username').populate('produk', 'nama_produk')
        res.json(feedbacks)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
})

// Update feedback (user dan admin)
router.put('/:id', authenticateToken, authorizeRoles('user', 'admin'), async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id)
        if (!feedback) return res.status(404).json({ msg: 'Feedback tidak ditemukan' })

        //hanya pemilik atau addmin
        if (feedback.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Akses ditolak: Hanya pemilik atau admin yang dapat mengubah feedback' })
        }

        feedback.rating = req.body.rating ?? feedback.rating
        feedback.komentar = req.body.komentar ?? feedback.komentar
        await feedback.save()

        res.json(feedback)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

// Delete feedback (admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id)
        if (!feedback) return res.status(404).json({ msg: 'Feedback tidak ditemukan' })
        res.json({ msg: 'Feedback berhasil dihapus' })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
})


module.exports = router;