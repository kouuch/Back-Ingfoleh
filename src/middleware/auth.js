require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { log, Logger } = require('winston');
const logger = require('../utils/logger');
const JWT_SECRET = process.env.JWT_SECRET


// verifikasi token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        logger.warn('Token tidak ditemukan');
        return next(new AppError('Token tidak ditemukan', 401));  // Jika token tidak ada, kirim error 401
    }

    logger.info('Verifying token: ', token);  // Log token untuk debugging

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            logger.error(`Token tidak valid atau expired: ${err.message}`);
            return next(new AppError('Token tidak valid atau expired', 403));  // Token invalid atau expired
        }

        req.user = user;  // Menyimpan data user yang terverifikasi ke req.user
        logger.info(`Token valid, user: ${user.id}, role: ${user.role}`);  // Log user dan role setelah token valid

        // Mengecek apakah role yang dimiliki sesuai dengan yang dibutuhkan (misalnya 'admin')
        if (user.role !== 'admin') {
            logger.warn(`Akses ditolak: User dengan role ${user.role} tidak diizinkan mengakses halaman ini`);
            return next(new AppError('Akses ditolak: Role tidak cukup', 403));  // Role tidak sesuai
        }

        next();  // Jika role sesuai, lanjutkan ke rute berikutnya
    });
}




// middleware cek role user

function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            logger.warn('User belum terautentikasi');
            return next(new AppError('User belum terautentikasi', 401));
        }

        logger.info(`User role: ${req.user.role}`);  // Log role pengguna

        if (allowedRoles.includes(req.user.role)) {
            next();
        } else {
            logger.warn(`Akses ditolak: Role ${req.user.role} tidak cukup untuk mengakses resource ini`);
            return next(new AppError('Akses ditolak: Role tidak cukup', 403));
        }
    };
}



module.exports = { authenticateToken, authorizeRoles };