const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = 'key';

// verifikasi token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.status(401).json({ msg: 'Token Tidak ditemukan' })

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ msg: 'Token tidak valid atau expired' })
        req.user = user;
        next();
    })
}

// middleware cek role user

function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ msg: 'User belum terautentikasi' })

        if (allowedRoles.includes(req.user.role)) {
            next()
        } else {
            return res.status(403).json({ msg: 'Akses ditolak: Role tidak cukup' })
        }
    }
}


module.exports = { authenticateToken, authorizeRoles };