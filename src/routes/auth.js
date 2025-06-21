require('dotenv').config()
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const rateLimit = require('express-rate-limit')
const logger = require('../utils/logger')
const AppError = require('../utils/AppError')


const JWT_SECRET = process.env.JWT_SECRET

// rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Terlalu banyak permintaan, silakan coba lagi nanti'
});

// Route untuk registrasi user
router.post('/register', async (req, res, next) => {
    const { username, email, password } = req.body;

    logger.info(`Registrasi request received for email: ${email}`)

    try {
        // cek apakah user sudah terdaftar
        const existingUserByEmail = await User.findOne({ email });
        const existingUserByUsername = await User.findOne({ username });

        if (existingUserByEmail || existingUserByUsername) {
            logger.warn(`Registrasi failed: User already exists with email: ${email} or username: ${username}`)
            return next(new AppError('User sudah terdaftar dengan email atau username tersebut', 400))
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        logger.info(`User registered successfully: ${email}`);

        res.status(201).json({ msg: "Registrasi Berhasil" });
    } catch (error) {
        logger.error(`Error during registration for email: ${email} - ${error.message}`);
        next(new AppError(error.message, 500));
    }
});


// Route untuk login user
// Route untuk login user
router.post('/login', limiter, async (req, res, next) => {
    const { emailOrUsername, password } = req.body; // Ambil input yang bisa berupa email atau username

    logger.info(`Login request received for email/username: ${emailOrUsername}`)

    try {
        // Cek apakah login menggunakan email atau username
        let user;
        if (emailOrUsername.includes('@')) {
            // Jika input mengandung '@', anggap itu adalah email
            user = await User.findOne({ email: emailOrUsername });
        } else {
            // Jika tidak mengandung '@', anggap itu adalah username
            user = await User.findOne({ username: emailOrUsername });
        }

        if (!user) {
            logger.warn(`Login failed: User not found with email/username: ${emailOrUsername}`)
            return next(new AppError('User Tidak ditemukan', 400))
        }

        // Cek password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn(`Login failed: Invalid password for email/username: ${emailOrUsername}`)
            return next(new AppError('Password salah', 400))
        }

        // Buat JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        logger.info(`Login successful for user: ${emailOrUsername}`)

        // Kirim token dan userId di response
        res.json({
            token,
            userId: user._id,  // Mengirimkan userId
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        logger.error(`Error during login for email/username: ${emailOrUsername} - ${error.message}`);
        next(new AppError(error.message, 500));
    }
});



module.exports = router
