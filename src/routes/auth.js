const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User')

const JWT_SECRET = 'key'

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body

        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(400).json({ msg: "User Sudah Terdaftar" })

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        await newUser.save()

        res.status(201).json({ msg: "Registrasi Berhasil" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "Server Error" })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ msg: "User Tidak ditemukan" })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ msg: "Pasword Salah" })

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' })

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        })
    } catch (error) {
        console.error(error)
    }
    res.status(500).json({ msg: "Server error" })
})

module.exports = router;