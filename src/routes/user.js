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
const JWT_SECRET = process.env.JWT_SECRE

// get all users (admin only)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res, next) => {
    try {
        const users = await User.find().select('-password')
        logger.info(`Fetched ${users.length} users`)
        res.json(users)
    } catch (error) {
        logger.error(`Error fetching users: ${error.message}`)
        next(new AppError(error.message, 500))
    }
})

// Endpoint untuk mengambil data profil pengguna
router.get('/me', authenticateToken, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        // Tambahkan log untuk memeriksa data yang dikirim
        console.log('User data from DB:', user);  // Log user data

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
router.put('/me', authenticateToken, authorizeRoles('user', 'admin'), validateUserInput, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const updateData = { ...req.body }

        // update password, hash dulu
        if (updateData.password) {
            const salt = await bcrypt.genSalt(10)
            updateData.password = await bcrypt.hash(updateData.password, salt)
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password')
        logger.info(`User profile updated successfully: ${userId}`)
        res.json(updatedUser)
    } catch (error) {
        logger.error(`Error updating user profile for ${userId}: ${error.message}`)
        next(new AppError(error.message, 400))
    }
})

// delete user (admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res, next) => {
    const userId = req.params.id;  // Mendapatkan ID pengguna dari parameter URL
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return next(new AppError('User tidak ditemukan', 404));
        }
        logger.info(`User successfully deleted: ${userId}`);
        res.json({ msg: 'User berhasil dihapus' });
    } catch (error) {
        logger.error(`Error deleting user with id ${userId}: ${error.message}`);
        next(new AppError(error.message, 500));
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

        // Update data profil pengguna dengan gambar baru
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