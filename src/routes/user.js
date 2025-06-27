const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { authenticateToken, authorizeRoles } = require('../middleware/auth')
const { validateUserInput } = require('../middleware/validationMiddleware')
const logger = require('../utils/logger')
const AppError = require('../utils/AppError')
const upload = require('../utils/upload');
const jwt = require('jsonwebtoken')
const { log } = require('winston')
const JWT_SECRET = process.env.JWT_SECRE

// get all users (admin only)
router.get('/admingetuser', authenticateToken, authorizeRoles('admin'), async (req, res, next) => {
    try {
        const users = await User.find().select('-password');
        logger.info(`Mengambil ${users.length} pengguna`);
        res.json(users);
    } catch (error) {
        logger.error(`Terjadi kesalahan saat mengambil pengguna: ${error.message}`);
        next(new AppError(error.message, 500));
    }
});

// Endpoint untuk mengambil data profil pengguna
router.get('/me', authenticateToken, async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Pengguna biasa hanya bisa mengakses data mereka sendiri
        if (req.user.role === 'user' && req.user.id !== userId) {
            return next(new AppError('Unauthorized access', 403));
        }

        // Admin bisa mengakses data pengguna lain
        if (req.user.role === 'admin' && req.user.id !== userId) {
            // Tidak perlu pengecekan lebih lanjut, admin bisa mengakses siapa saja
        }

        const user = await User.findById(userId).select('-password');

        logger.info('Profile picture in database:', user.profilePicture);
        console.log('Profile picture in database:', user.profilePicture);

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        // Mengirimkan data pengguna
        res.json({
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture || '/images/userDefault/user.png',
            status_akun: user.status_akun,
            no_telepon: user.no_telepon || 'N/A',
            tanggal_daftar: user.tanggal_daftar,
        });
    } catch (error) {
        logger.error(`Error fetching user profile: ${error.message}`);
        next(new AppError(error.message, 500));
    }
});

// update Profile (user atau admin)
router.put('/me', authenticateToken, authorizeRoles('user', 'admin'), upload.single('profilePicture'), validateUserInput, async (req, res, next) => {
    try {
        const userId = req.user.id;  // ID pengguna yang sedang login
        let updateData = { ...req.body };

        // Pastikan user hanya bisa mengedit data mereka sendiri (bukan data pengguna lain)
        if (req.user.role === 'user' && req.user.id !== userId) {
            return next(new AppError('Unauthorized access', 403));  // Jika ID tidak cocok, akses ditolak
        }

        // Jangan izinkan pengeditan status_akun dan tanggal_daftar
        if (updateData.status_akun || updateData.tanggal_daftar) {
            return next(new AppError('Status Akun dan Tanggal Daftar tidak dapat diubah', 400));
        }

        // Jika ada foto profil yang diupload, simpan foto baru
        if (req.file) {
            logger.warn('File upload detected:', req.file);  // Log informasi file yang di-upload
            logger.info('File uploaded:', req.file);  // Log informasi file yang di-upload
            console.log('File uploaded:', req.file);  // Log path dan informasi file yang di-upload
            updateData.profilePicture = `/uploads/${req.file.filename}`;
        }

        // Perbarui data pengguna
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
        logger.info(`User profile updated successfully: ${userId}`);
        res.json(updatedUser);
    } catch (error) {
        logger.error(`Error updating user profile for ${userId}: ${error.message}`);
        next(new AppError(error.message, 400));
    }
});



// Hapus user (admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res, next) => {
    const userId = req.params.id;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return next(new AppError('User tidak ditemukan', 404));
        }
        logger.info(`User berhasil dihapus: ${userId}`);
        res.json({ msg: 'User berhasil dihapus' });
    } catch (error) {
        logger.error(`Error menghapus user dengan ID ${userId}: ${error.message}`);
        next(new AppError('Terjadi kesalahan saat menghapus pengguna', 500));
    }
});




// Endpoint untuk meng-upload gambar profil
router.post('/uploadProfilePicture', upload.single('profilePicture'), async (req, res) => {
    try {
        if (!req.file) {
            logger.error('No file uploaded for profile picture');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Verifikasi token JWT untuk mendapatkan ID pengguna
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            logger.error('No token provided for profile picture upload');
            return res.status(403).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        // Simpan URL gambar profil di database
        const profilePictureUrl = `/uploads/${req.file.filename}`;
        const user = await User.findByIdAndUpdate(userId, { profilePicture: profilePictureUrl }, { new: true });

        if (!user) {
            logger.error(`User not found with id: ${userId}`);
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Profile picture updated successfully', user });

    } catch (err) {
        logger.error(`Error uploading profile picture: ${err.message}`);
        console.error('Error uploading profile picture:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router