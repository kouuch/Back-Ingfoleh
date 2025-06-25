const express = require('express');
const Kategori = require('../models/Kategori'); // Import model Kategori
const { authenticateToken, authorizeRoles } = require('../middleware/auth'); // Pastikan hanya admin yang bisa mengakses
const { log } = require('winston');
const logger = require('../utils/logger');
const router = express.Router();

// Menambahkan kategori baru
router.post('/kategori', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { nama_kategori } = req.body;

    try {

        if (!nama_kategori) {
            log
            return res.status(400).send('Nama kategori diperlukan');
        }


        const existingCategory = await Kategori.findOne({ nama_kategori });
        if (existingCategory) {
            logger.warn(`Kategori dengan nama ${nama_kategori} sudah ada`);
            return res.status(400).send('Kategori sudah ada');
        }
        const newCategory = new Kategori({ nama_kategori });
        await newCategory.save();

        res.status(201).send('Kategori berhasil ditambahkan');
    } catch (error) {
        logger.error(`Error adding category: ${error.message}`);
        console.error('Error adding category:', error);
        res.status(500).send('Server Error');
    }
});



module.exports = router;
