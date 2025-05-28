const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs');
const { authenticateToken, authorizeRoles } = require('../middleware/auth')

// get all users (admin only)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const users = await User.find().select('-password')
        res.json(users)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
})

// update Profile (user atau admin)
router.put('/me', authenticateToken, authorizeRoles('user', 'admin'), async (req, res) => {
    try {
        const userId = req.user.id;
        const updateData = { ...req.body }

        // update password, hash dulu
        if (updateData.password) {
            const salt = await bcrypt.genSalt(10)
            updateData.password = await bcrypt.hash(updateData.password, salt)
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password')
        res.json(updatedUser)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

// delete user (admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) return res.status(404).json({ msg: 'User tidak ditemukan' })
        res.json({ msg: 'User berhasil dihapus' })
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
})

module.exports = router