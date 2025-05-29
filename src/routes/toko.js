const express = require('express')
const router = express.Router()
const Toko = require('../models/Toko')
const { authenticateToken, authorizeRoles } = require('../middleware/auth')

// Create toko (admin only)
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const toko = new Toko(req.body)
        await toko.save()
        res.status(201).json(toko)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

//read semua (public)
router.get('/', async (req, res) => {
    try {
        const tokos = await Toko.find()
        res.json(tokos)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
})

// Update toko (admin only)
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) =>{
    try {
        const toko = await Toko.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json(toko)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

// Delete toko (admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const toko = await Toko.findByIdAndDelete(req.params.id)
        if (!toko) return res.status(404).json({ msg: 'Toko tidak ditemukan' })
        res.json({ msg: 'Toko berhasil dihapus' })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
})

module.exports = router