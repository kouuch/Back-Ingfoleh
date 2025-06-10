const express = require('express')
const router = express.Router()
const Toko = require('../models/Toko')
const { authenticateToken, authorizeRoles } = require('../middleware/auth')
const { validateStoreInput } = require('../middleware/validationMiddleware')
const logger = require('../utils/logger')

// Create toko (admin only)
router.post('/', authenticateToken, authorizeRoles('admin'), validateStoreInput, async (req, res) => {
    try {
        const toko = new Toko(req.body)
        await toko.save()
        logger.info(`Store created successfully: ${toko._id}`)
        res.status(201).json(toko)
    } catch (error) {
        logger.error(`Error creating store: ${error.message}`)
        res.status(400).json({ msg: error.message })
    }
})

//read semua (public)
router.get('/', async (req, res) => {
    try {
        const tokos = await Toko.find()
        logger.info(`Fetched ${tokos.length} stores`)
        res.json(tokos)
    } catch (error) {
        logger.error(`Error fetching stores: ${error.message}`)
        res.status(500).json({ msg: error.message })
    }
})

// Update toko (admin only)
router.put('/:id', authenticateToken, authorizeRoles('admin'), validateStoreInput, async (req, res) =>{
    try {
        const toko = await Toko.findByIdAndUpdate(req.params.id, req.body, { new: true })
        logger.error(`Error fetching stores: ${error.message}`)
        res.json(toko)
    } catch (error) {
        logger.error(`Error updating store: ${error.message}`)
        res.status(400).json({ msg: error.message })
    }
})

// Delete toko (admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const toko = await Toko.findByIdAndDelete(req.params.id)
        if (!toko) {
            logger.warn(`Store with id ${req.params.id} not found`)
            return res.status(404).json({ msg: 'Toko tidak ditemukan' })
        }

        logger.info(`Store successfully deleted: ${req.params.id}`)
        res.json({ msg: 'Toko berhasil dihapus' })
    } catch (error) {
        logger.error(`Error deleting store with ID ${req.params.id}: ${error.message}`)
        res.status(500).json({ msg: error.message })
    }
})

module.exports = router