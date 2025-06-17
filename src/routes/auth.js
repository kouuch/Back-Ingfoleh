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
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            logger.warn(`Registrasi failed: User already exists with email: ${email}`)
            return next(new AppError('User sudah terdaftar', 400))
        }

        // hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        await newUser.save()

        logger.info(`User registered successfully: ${email}`)

        res.status(201).json({ msg: "Registrasi Berhasil" })
    } catch (error) {
        logger.error(`Error during registration for email: ${email} - ${error.message}`)
        next(new AppError(error.message , 500))
    }
});

// Route untuk login user
router.post('/login', limiter, async (req, res, next) => {
    const { email, password } = req.body;

    logger.info(`Login request received for email: ${email}`)

    try {
        const user = await User.findOne({ email })
        if (!user) {
            logger.warn(`Login failed: User not found with email: ${email}`)
            return next(new AppError('User Tidak ditemukan' , 400))
        }

        // cek password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            logger.warn(`Login failed: Invalid password for email: ${email}`)
            return next(new AppError('Password salah', 400))
        }

        // buat JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' })

        logger.info(`Login successful for user: ${email}`)

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        })
    } catch (error) {
        logger.error(`Error during login for email: ${email} - ${error.message}`)
        next(new AppError(error.message, 500))
    }
});

module.exports = router
