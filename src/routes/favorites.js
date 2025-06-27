const express = require('express');
const router = express.Router();
const KategoriFavorit = require('../models/KategoriFavorit');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const logger = require('../utils/logger');

router.get('/', authenticateToken, authorizeRoles('admin', 'user'), async (req, res, next) => {
    const userId = req.user.id; 
    logger.info(`Fetching favorites for user: ${userId}`);

    try {
        const favorit = await KategoriFavorit.find()
            .populate('id_produk', 'nama_produk')
            .populate('id_kategori', 'nama_kategori')
            .exec();

        if (!favorit || favorit.length === 0) {
            logger.warn(`Tidak ada produk favorit untuk userId: ${userId}`);
            return res.status(404).send('Tidak ada produk favorit untuk user ini');
        }

        logger.info(`Produk favorit ditemukan untuk userId: ${userId}, total favorit: ${favorit.length}`);
        res.status(200).json(favorit);
    } catch (error) {
        logger.error(`Error fetching favorit data for userId ${userId}: ${error.message}`);
        next(new AppError(error.message, 500));
    }
});








module.exports = router;
