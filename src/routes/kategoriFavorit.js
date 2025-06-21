const express = require('express');
const router = express.Router();
const KategoriFavorit = require('../models/KategoriFavorit');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

// Get laporan kategori favorit (admin only)
// Admin melihat history produk yang di-like oleh pengguna
router.get('/admin/favorit', authenticateToken, authorizeRoles('admin'), async (req, res, next) => {
    try {
        // Ambil seluruh produk favorit dari semua pengguna
        const favoritData = await KategoriFavorit.find()
            .populate('id_produk')  // Menyertakan detail produk
            .exec();

        if (!favoritData || favoritData.length === 0) {
            return res.status(404).json({ message: "Tidak ada produk favorit" });
        }

        res.status(200).json(favoritData);  // Mengirimkan data favorit
    } catch (error) {
        logger.error(`Error fetching favorit data: ${error.message}`);
        return next(new AppError('Error fetching favorit data', 500));
    }
});



// Menambahkan produk ke favorit (Hanya pengguna yang terautentikasi)
// Menambahkan produk ke favorit
// Menambahkan produk ke favorit (Hanya pengguna yang terautentikasi)
// Menambahkan produk ke favorit
// Menambahkan produk ke favorit
router.post('/', authenticateToken, async (req, res) => {
    const { id_produk, nama_produk, id_kategori, nama_kategori } = req.body;
    const userId = req.user.id;  // Mendapatkan user_id dari token

    try {
        // Cek apakah produk sudah ada di favorit
        const existingFavorit = await KategoriFavorit.findOne({ id_produk, user_id: userId });

        if (existingFavorit) {
            return res.status(400).json({ message: 'Produk sudah ada di favorit' });
        }

        // Menambahkan produk ke favorit
        const favorit = new KategoriFavorit({
            id_produk,
            nama_produk,
            id_kategori,
            nama_kategori,
            user_id: userId
        });

        await favorit.save();

        // Update jumlah favorit produk di database
        await KategoriFavorit.updateOne(
            { id_produk },
            { $inc: { jumlah_favorit: 1 } }  // Increment jumlah_favorit
        );

        res.status(201).json({ message: 'Produk berhasil ditambahkan ke favorit', favoriteId: favorit._id });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});


// Menghapus produk dari favorit
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;  // Mendapatkan user_id dari token

    try {
        const favorit = await KategoriFavorit.findOneAndDelete({ _id: id, user_id: userId });

        if (!favorit) {
            return res.status(404).json({ message: 'Favorit tidak ditemukan atau tidak milik user yang sedang login' });
        }

        // Update jumlah favorit produk di database
        await KategoriFavorit.updateOne(
            { id_produk: favorit.id_produk },
            { $inc: { jumlah_favorit: -1 } }  // Decrement jumlah_favorit
        );

        res.status(200).json({ message: 'Produk berhasil dihapus dari favorit' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});



// Mengambil daftar produk favorit berdasarkan user_id saat login
router.get('/like', authenticateToken, async (req, res, next) => {
    const userId = req.user.id;
    try {
        const favorit = await KategoriFavorit.find({ user_id: userId })
            .populate('id_produk', 'nama_produk')
            .populate('id_kategori', 'nama_kategori')
            .exec();

        if (!favorit || favorit.length === 0) {
            return res.status(404).send('Tidak ada produk favorit untuk user ini');
        }
        res.status(200).json(favorit);
    } catch (error) {
        next(new AppError(error.message, 500));
    }
});




module.exports = router;