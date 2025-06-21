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
// Menambahkan produk ke favorit dan mengupdate jumlah favorit
router.post('/', authenticateToken, async (req, res) => {
    const { id_produk, nama_produk, id_kategori, nama_kategori } = req.body;
    const userId = req.user.id;

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

        // Update jumlah favorit di produk (menggunakan aggregate)
        await KategoriFavorit.aggregate([
            { $match: { id_produk: id_produk } },
            { $group: { _id: "$id_produk", totalFavorit: { $sum: 1 } } }
        ]);

        res.status(201).json({ message: 'Produk berhasil ditambahkan ke favorit', favoriteId: favorit._id });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});








// Mengambil daftar produk favorit berdasarkan user_id (untuk pengguna yang terautentikasi)
// Mengambil produk favorit berdasarkan user_id
// Mengambil daftar produk favorit berdasarkan user_id
// Mengambil daftar produk favorit berdasarkan user_id
// Mengambil daftar produk favorit berdasarkan user_id saat login
router.get('/like', authenticateToken, authorizeRoles('admin', 'user'), async (req, res, next) => {
    const userId = req.user.id; // Ambil userId dari token yang terautentikasi
    logger.info(`Fetching favorites for user: ${userId}`);

    try {
        // Cari produk favorit yang dimiliki oleh user berdasarkan user_id
        const favorit = await KategoriFavorit.find({ user_id: userId })
            .populate('id_produk', 'nama_produk foto kisaran_harga')  // Memuat detail produk terkait
            .populate('id_kategori', 'nama_kategori')  // Memuat kategori produk terkait
            .exec();

        // Jika tidak ada produk favorit untuk user
        if (!favorit || favorit.length === 0) {
            logger.warn(`Tidak ada produk favorit untuk userId: ${userId}`);
            return res.status(404).send('Tidak ada produk favorit untuk user ini');
        }

        // Jika ditemukan produk favorit, kirimkan sebagai respon
        logger.info(`Produk favorit ditemukan untuk userId: ${userId}, total favorit: ${favorit.length}`);
        res.status(200).json(favorit);  // Mengembalikan produk favorit untuk user tersebut
    } catch (error) {
        // Jika terjadi error, log dan kirimkan error ke client
        logger.error(`Error fetching favorite data for userId ${userId}: ${error.message}`);
        next(new AppError(error.message, 500));
    }
});






// Menghapus produk dari favorit berdasarkan _id favorit
// Menghapus produk dari favorit berdasarkan _id favorit
// Menghapus produk favorit berdasarkan user_id dan favoriteId
// Menghapus produk dari favorit berdasarkan user_id dan favoriteId
// Menghapus produk dari favorit berdasarkan _id favorit dan memastikan user_id yang cocok
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;  // Mengambil _id favorit dari parameter URL
    const userId = req.user.id; // Mendapatkan user_id dari token yang terautentikasi

    try {
        // Cari favorit yang dimiliki oleh user yang sedang login
        const favorit = await KategoriFavorit.findOneAndDelete({ _id: id, user_id: userId });

        if (!favorit) {
            logger.warn(`Favorit dengan id ${id} tidak ditemukan atau tidak milik user ${userId}`);
            return res.status(404).json({ message: 'Favorit tidak ditemukan atau tidak milik user yang sedang login' });
        }

        // Menghapus favorit
        await KategoriFavorit.findByIdAndDelete(id);
        logger.info(`Produk dengan id ${favorit.id_produk} berhasil dihapus dari favorit oleh user ${userId}`);
        res.status(200).json({ message: 'Produk berhasil dihapus dari favorit' });
    } catch (error) {
        logger.error(`Error deleting from favorites: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
});




module.exports = router;