const express = require('express');
const router = express.Router();
const Produk = require('../models/Produk');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');


//create produk hanya admin
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const produk = new Produk(req.body);
        await produk.save();
        return res.status(201).json(produk);
    } catch (error) {
        console.error("Error while creating product:", error);
        res.status(400).json({ msg: error.message });
    }
});


// read semua
router.get('/', async (req, res) => {
    try {
        const produk = await Produk.find()
        res.json(produk)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
})

// update produk hanya admin
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const produk = await Produk.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!produk) return res.status(404).json({ msg: 'Produk tidak ditemukan' })
        res.json(produk)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

// Dlete produk hanya admin
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const produk = await Produk.findByIdAndDelete(req.params.id);
        if (!produk) {
            return res.status(404).json({ msg: 'Produk tidak ditemukan' });
        }
        res.json({ msg: 'Produk berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

module.exports = router;
