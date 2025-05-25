const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');


//create produk hanya admin
router.post('/', authenticateToken, authorizeRoles('admin'), (req, res) => {
    res.json({ msg: 'Produk berhasil dibuat oleh admin' });
});

// laporan bisa admin dan user
router.get('/laporan', authenticateToken, authorizeRoles('admin', 'user'), (req, res) => {
    res.json({ msg: 'Data laporan untuk admin dan user' });
});
//(guest)
router.get('/public', (req, res) => {
    res.json({ msg: 'Halaman publik bisa diakses guest' });
});

module.exports = router;
