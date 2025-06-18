const express = require('express');
const router = express.Router();
const KategoriFavorit = require('../models/KategoriFavorit');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

// get laporan kategori favorit (admin only)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res, next) =>{
    try {
        const data = await KategoriFavorit.find()
            res.json(data)
    } catch (error) {
        logger.error(`Error fetching kategori favorit: ${error.message}`);
        next(new AppError(error.message, 500))
    }
})

// Menambahkan produk ke favorit
router.post('/', authenticateToken, async (req, res) => {
    const { productId } = req.body;
    try {
        const favorit = new KategoriFavorit({ productId, userId: req.user.id });
        await favorit.save();
        res.status(201).send('Produk berhasil ditambahkan ke favorit');
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// Menghapus produk dari favorit
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        await KategoriFavorit.findByIdAndDelete(id);
        res.status(200).send('Produk berhasil dihapus dari favorit');
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;