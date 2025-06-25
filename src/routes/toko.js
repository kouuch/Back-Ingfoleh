const express = require('express')
const router = express.Router()
const Toko = require('../models/Toko')
const { authenticateToken, authorizeRoles } = require('../middleware/auth')
const { validateStoreInput } = require('../middleware/validationMiddleware')
const logger = require('../utils/logger')
const AppError = require('../utils/AppError')

// Create toko (admin only)
router.post('/admincreate', authenticateToken, authorizeRoles('admin'), validateStoreInput, async (req, res, next) => {
    try {
        // ambit data dari body request
        const { nama_toko, kabupaten_kota, alamat_lengkap, kontak_toko } = req.body

        // membuat objek Toko baru
        const toko = new Toko({
            nama_toko,
            kabupaten_kota,
            alamat_lengkap,
            kontak_toko
        })
        // simpan toko ke database
        await toko.save()
        logger.info(`Store created successfully: ${toko._id}`)
        res.status(201).json(toko)
    } catch (error) {
        logger.error(`Error creating store: ${error.message}`)
        next(new AppError(error.message, 400))
    }
})

//read semua (public)
router.get('/admintoko', async (req, res, next) => {
    try {
        const tokos = await Toko.find()
        logger.info(`Fetched ${tokos.length} stores`)
        res.json(tokos)
    } catch (error) {
        logger.error(`Error fetching stores: ${error.message}`)
        next(new AppError(error.message, 500))
    }
})

router.get('/admintoko/:id', authenticateToken, async (req, res, next) => {
    try {
        const toko = await Toko.findById(req.params.id);  // Mengambil toko berdasarkan ID
        if (!toko) {
            return res.status(404).json({ message: 'Toko tidak ditemukan' });
        }
        res.json(toko);  // Mengembalikan data toko
    } catch (error) {
        next(new AppError('Error fetching store: ' + error.message, 400));
    }
});


// Update toko (admin only)
router.put('/admintoko/:id', authenticateToken, authorizeRoles('admin'), validateStoreInput, async (req, res, next) => {
    try {
        // Ambil data dari request body dan update toko berdasarkan ID
        const { nama_toko, kabupaten_kota, alamat_lengkap, kontak_toko } = req.body;

        // Update toko berdasarkan ID dan kembalikan data toko yang diperbarui
        const toko = await Toko.findByIdAndUpdate(req.params.id, { nama_toko, kabupaten_kota, alamat_lengkap, kontak_toko }, { new: true });

        if (!toko) {
            return next(new AppError('Toko tidak ditemukan', 404));
        }

        logger.info(`Store updated successfully: ${toko._id}`);
        res.json(toko);
    } catch (error) {
        logger.error(`Error updating store: ${error.message}`);
        next(new AppError(error.message, 400));
    }
});


// Delete toko (admin only)
router.delete('/delete:id', authenticateToken, authorizeRoles('admin'), async (req, res, next) => {
    try {
        const toko = await Toko.findByIdAndDelete(req.params.id)
        if (!toko) {
            logger.warn(`Store with id ${req.params.id} not found`)
            return next(new AppError('Toko tidak ditemukan', 404))
        }

        logger.info(`Store successfully deleted: ${req.params.id}`)
        res.json({ msg: 'Toko berhasil dihapus' })
    } catch (error) {
        logger.error(`Error deleting store with ID ${req.params.id}: ${error.message}`)
        next(new AppError(error.message, 500))
    }
})

module.exports = router