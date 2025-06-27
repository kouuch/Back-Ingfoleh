// const express = require('express');
// const router = express.Router();
// const { authenticateToken } = require('../middleware/auth');
// const Produk = require('../models/Produk');  // Pastikan import dengan benar
// const logger = require('../utils/logger');


// // route untuk admin products
// app.get('/adminproducts', authenticateToken, async (req, res) => {
//     // Verifikasi role admin sebelum merender halaman
//     if (req.user.role !== 'admin') {
//         return res.status(403).json({ message: 'Akses ditolak: Anda bukan admin' });
//     }
//     try {
//         res.render('adminproduct'); // Render halaman adminproduct.ejs
//     } catch (error) {
//         logger.error('Error rendering admin products page:', error);
//         res.status(500).send('Error rendering page');
//     }
// });



// module.exports = router;
