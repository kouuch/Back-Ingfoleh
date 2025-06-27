const { body, validationResult } = require('express-validator');
const AppError = require('../utils/AppError')

//validasi input produk
// Validasi input produk
const validateProductInput = [
    body('nama_produk').not().isEmpty().withMessage('Nama produk harus diisi'),
    body('kategori').not().isEmpty().withMessage('Kategori harus diisi'),
    body('kisaran_harga').isNumeric().withMessage('Kisaran harga harus berupa angka'),
    body('lokasi_penjual').not().isEmpty().withMessage('Lokasi penjual harus diisi'),
    body('kontak_penjual').not().isEmpty().withMessage('Kontak penjual harus diisi'),

    // Validasi foto
    (req, res, next) => {
        if (!req.file) {
            return next(new AppError('Foto produk harus diisi', 400)); 
        }
        next(); 
    },

    // Hasil validasi
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return next(new AppError('Input tidak valid', 400, errors.array()))
        }
        next()
    }
]


//validasi input user (register dan update)
const validateUserInput = [
    body('username').optional().not().isEmpty().withMessage('Username harus diisi'),
    body('email').optional().isEmail().withMessage('Email harus valid'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password harus minimal 6 karakter'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Role tidak valid'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new AppError('Input tidak valid', 400, errors.array()));
        }
        next();
    }
];




// Validasi input untuk toko
const validateStoreInput = [
    body('nama_toko').not().isEmpty().withMessage('Nama toko wajib diisi'),
    body('kabupaten_kota').not().isEmpty().withMessage('Kabupaten/Kota wajib diisi'),
    body('alamat_lengkap').not().isEmpty().withMessage('Alamat lengkap wajib diisi'),
    body('kontak_toko').not().isEmpty().withMessage('Kontak toko wajib diisi'),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return next(new AppError('Input tidak valid', 400, errors.array()))
        }
        next()
    }
]

module.exports = {
  validateProductInput,
  validateUserInput,
  validateStoreInput
};