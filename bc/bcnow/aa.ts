const express = require('express');
const router = express.Router();
const KategoriFavorit = require('../models/KategoriFavorit');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

// Get laporan kategori favorit (admin only)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res, next) => {
    try {
        const data = await KategoriFavorit.find()
            .populate('id_produk')  // Mengisi detail produk
            .exec();
        res.json(data);
    } catch (error) {
        logger.error(`Error fetching kategori favorit: ${error.message}`);
        next(new AppError(error.message, 500));
    }
});

// Menambahkan produk ke favorit (Hanya pengguna yang terautentikasi)
// Menambahkan produk ke favorit
router.post('/', authenticateToken, async (req, res) => {
    const { id_produk, nama_produk, id_kategori, nama_kategori } = req.body;
    const userId = req.user.id;  // Mengambil userId dari token yang sudah terautentikasi

    try {
        // Validasi data
        if (!id_produk || !nama_produk || !id_kategori || !nama_kategori) {
            logger.warn('Product data is incomplete');
            return res.status(400).json({ message: 'Product data is incomplete' });
        }

        // Cek apakah produk sudah ada di favorit
        const existingFavorit = await KategoriFavorit.findOne({ id_produk, userId });
        if (existingFavorit) {
            logger.warn(`Produk dengan id ${id_produk} sudah ada di favorit untuk user ${userId}`);
            return res.status(400).json({ message: 'Produk sudah ada di favorit' });
        }

        // Menambahkan produk ke favorit, pastikan user_id ada
        const favorit = new KategoriFavorit({
            id_produk,
    nama_produk,
    id_kategori,
    nama_kategori,
    user_id: userId  // Menambahkan user_id ke data favorit
        });

        await favorit.save();
        logger.info(`Produk dengan id ${id_produk} berhasil ditambahkan ke favorit oleh user ${userId}`);
        res.status(201).json({ message: 'Produk berhasil ditambahkan ke favorit', favoriteId: favorit._id });
    } catch (error) {
        logger.error(`Error adding to favorites: ${error.message}`);
        console.error('Error adding to favorites:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});






// Mengambil daftar produk favorit berdasarkan user_id (untuk pengguna yang terautentikasi)
// Mengambil produk favorit berdasarkan user_id
// Mengambil daftar produk favorit berdasarkan user_id
// Menghapus produk dari favorit berdasarkan _id favorit dan user_id
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;  // Mengambil _id favorit dari parameter URL
    const userId = req.user.id;  // Ambil userId dari token

    try {
        // Cek apakah favorit yang ingin dihapus milik user yang sedang login
        const favorit = await KategoriFavorit.findOneAndDelete({ _id: id, userId });

        if (!favorit) {
            logger.warn(`Favorit dengan id ${id} tidak ditemukan atau tidak milik user yang sedang login`);
            return res.status(404).json({ message: 'Favorit tidak ditemukan atau tidak milik user yang sedang login' });
        }

        res.status(200).json({ message: 'Produk berhasil dihapus dari favorit' });
    } catch (error) {
        logger.error(`Error deleting from favorites: ${error.message}`);
        console.error('Error deleting from favorites:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});



// Menghapus produk dari favorit berdasarkan _id favorit
// Menghapus produk dari favorit berdasarkan _id favorit
// Menghapus produk favorit berdasarkan user_id dan favoriteId
// Menghapus produk dari favorit berdasarkan user_id dan favoriteId
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;  // Ambil userId dari token yang sudah terautentikasi
    try {
        // Mencari favorit berdasarkan id dan memastikan user_id sesuai dengan user yang sedang login
        const favorit = await KategoriFavorit.findOne({ _id: id, user_id: userId });

        if (!favorit) {
            logger.warn(`Favorit dengan id ${id} tidak ditemukan atau tidak milik user yang sedang login`);
            return res.status(404).json({ message: 'Favorit tidak ditemukan atau tidak milik user yang sedang login' });
        }

        // Jika favorit ditemukan, hapus favorit
        await KategoriFavorit.findByIdAndDelete(id);
        logger.info(`Favorit dengan id ${id} berhasil dihapus oleh user ${userId}`);
        res.status(200).json({ message: 'Produk berhasil dihapus dari favorit' });
    } catch (error) {
        logger.error(`Error deleting from favorites: ${error.message}`);
        console.error('Error deleting from favorites:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});





module.exports = router;
