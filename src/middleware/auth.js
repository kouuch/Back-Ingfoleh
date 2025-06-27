require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { log, Logger } = require('winston');
const logger = require('../utils/logger');
const JWT_SECRET = process.env.JWT_SECRET


// verifikasi token
function authenticateToken(req, res, next) {
    let token = null;
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        // Atau cek di cookie untuk GET page biasa
        token = req.cookies.token;
    }
    if (!token) {
        logger.warn('Token tidak ditemukan');
        return next(new AppError('Token tidak ditemukan', 401));
    }

    logger.info('Verifying token: ', token);
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            logger.error(`Token tidak valid atau expired: ${err.message}`);
            return next(new AppError('Token tidak valid atau expired', 401));
        }
        req.user = user;
        logger.info(`Token valid, user: ${user.id}, role: ${user.role}`);
        next();
    });
}


// middleware cek role user
function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            logger.warn('User belum terautentikasi');
            return next(new AppError('User belum terautentikasi', 401));
        }

        logger.info(`User role: ${req.user.role}`);

        if (allowedRoles.includes(req.user.role)) {

            if (req.user.role === 'user' && req.user.id !== req.user.id) {
                return next(new AppError('Unauthorized access', 403));
            }
            next();
        } else {
            logger.warn(`Akses ditolak: Role ${req.user.role} tidak cukup untuk mengakses resource ini`);
            return next(new AppError('Akses ditolak: Role tidak cukup', 403));
        }
    };
}





module.exports = { authenticateToken, authorizeRoles };