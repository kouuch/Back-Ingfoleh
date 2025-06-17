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

module.exports = router;