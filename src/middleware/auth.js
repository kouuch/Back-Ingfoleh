const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { log, Logger } = require('winston');
const logger = require('../utils/logger');
const JWT_SECRET = 'key';


// verifikasi token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        logger.warn('Token tidak ditemukan')
        return next(new AppError('Token tidak ditemukan', 401))
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            logger.error(`Token tidak valid atau expired: ${err.message}`)
            return next(new AppError('Token tidak valid atau expired', 403))
        }
        req.user = user;
        next();
    })
}

// middleware cek role user

function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            logger.warn('User belum terautentikasi')
            return next(new AppError('User belum terautentikasi', 401))
        }
        if (allowedRoles.includes(req.user.role)) {
            next()
        } else {
            Logger.warn(`Akses ditolak: User dengan role ${req.user.role} mencoba mengakses route yang tidak diizinkan`)
            return next(new AppError('Akses ditolak: Role tidak cukup', 403))
        }
    }
}


module.exports = { authenticateToken, authorizeRoles };