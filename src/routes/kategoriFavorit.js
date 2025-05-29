const express = require('express');
const router = express.Router();
const KategoriFavorit = require('../models/KategoriFavorit');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// get laporan kategori favorit (admin only)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) =>{
    try {
        const data = await KategoriFavorit.find()
            res.json(data)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
})

module.exports = router;