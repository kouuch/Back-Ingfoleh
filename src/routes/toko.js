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

// Update toko (admin only)
router.put('/:id', authenticateToken, authorizeRoles('admin'), validateStoreInput, async (req, res, next) =>{
    try {
        const toko = await Toko.findByIdAndUpdate(req.params.id, req.body, { new: true })
        logger.error(`Error fetching stores: ${error.message}`)
        res.json(toko)
    } catch (error) {
        logger.error(`Error updating store: ${error.message}`)
        next(new AppError(error.message, 400))
    }
})

// Delete toko (admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res, next) => {
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