const { body, validationResult } = require('express-validator');

//validasi input produk
const validateProductInput = [
    body('nama_produk').not().isEmpty().withMessage('Nama produk harus diisi'),
    body('kategori').not().isEmpty().withMessage('Kategori harus diisi'),
    body('kisaran_harga').isNumeric().withMessage('Kisaran harga harus berupa angka'),
    body('lokasi_penjual').not().isEmpty().withMessage('Lokasi penjual harus diisi'),
    body('kontak_penjual').not().isEmpty().withMessage('Kontak penjual harus diisi'),
    body('foto').not().isEmpty().withMessage('Foto produk harus diisi'),

    //hasil
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        next()
    }
]

//validasi input user (register dan update)
const validateUserInput = [
    body('username').not().isEmpty().withMessage('Username harus diisi'),
    body('email').isEmail().withMessage('Email harus valid'),
    body('password').isLength({ min: 6 }).withMessage('Password harus minimal 6 karakter'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Role tidak valid'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        next()
    }
]

//validasi input feedback
const validateFeedbackInput = [
    body('produk').isMongoId().withMessage('Produk ID tidak valid'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating harus antara 1 dan 5'),
    body('komentar').optional().isLength({ min: 5 }).withMessage('Komentar harus lebih dari 5 karakter'),


    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        next()
    }
]

// Validasi input untuk toko
const validateStoreInput = [
    body('nama_toko').not().isEmpty().withMessage('Nama toko wajib diisi'),
    body('kabupaten_kota').not().isEmpty().withMessage('Kabupaten/Kota wajib diisi'),
    body('alamat_lengkap').not().isEmpty().withMessage('Alamat lengkap wajib diisi'),
    body('latitude').isNumeric().withMessage('Latitude harus berupa angka'),
    body('longitude').isNumeric().withMessage('Longitude harus berupa angka'),
    body('kontak_toko').not().isEmpty().withMessage('Kontak toko wajib diisi'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        next()
    }
]

module.exports = {
  validateProductInput,
  validateUserInput,
  validateFeedbackInput,
  validateStoreInput
};