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
        const existingUserByEmail = await User.findOne({ email });
        const existingUserByUsername = await User.findOne({ username });

        if (existingUserByEmail || existingUserByUsername) {
            logger.warn(`Registrasi failed: User already exists with email: ${email} or username: ${username}`)
            return next(new AppError('User sudah terdaftar dengan email atau username tersebut', 400))
        }

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
router.post('/login', limiter, async (req, res, next) => {
    const { emailOrUsername, password } = req.body; 

    logger.info(`Login request received for email/username: ${emailOrUsername}`)

    try {
        let user;
        if (emailOrUsername.includes('@')) {
            user = await User.findOne({ email: emailOrUsername });
        } else {
            user = await User.findOne({ username: emailOrUsername });
        }

        if (!user) {
            logger.warn(`Login failed: User not found with email/username: ${emailOrUsername}`)
            return next(new AppError('User Tidak ditemukan', 400))
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn(`Login failed: Invalid password for email/username: ${emailOrUsername}`)
            return next(new AppError('Password salah', 400))
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        logger.info(`user role:`, user.role)
        logger.info(`Login successful for user: ${emailOrUsername}`)

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 1 * 60 * 60 * 1000 
        });

        res.json({
            token,
            userId: user._id,  
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        logger.error(`Error during login for email/username: ${emailOrUsername} - ${error.message}`);
        next(new AppError(error.message, 500));
    }
});



module.exports = router
