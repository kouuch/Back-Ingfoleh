const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { authenticateToken, authorizeRoles } = require('../middleware/auth')
const { validateUserInput } = require('../middleware/validationMiddleware')
const logger = require('../utils/logger')

// get all users (admin only)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const users = await User.find().select('-password')
        logger.info(`Fetched ${users.length} users`)
        res.json(users)
    } catch (error) {
        logger.error(`Error fetching users: ${error.message}`)
        res.status(500).json({ msg: error.message })
    }
})

// update Profile (user atau admin)
router.put('/me', authenticateToken, authorizeRoles('user', 'admin'), validateUserInput, async (req, res) => {
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
        res.status(400).json({ msg: error.message })
    }
})

// delete user (admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        logger.warn(`User with id ${userId} not found`)
        if (!user) return res.status(404).json({ msg: 'User tidak ditemukan' })

        logger.info(`User successfully deleted: ${userId}`)
        res.json({ msg: 'User berhasil dihapus' })
    } catch (error) {
        logger.error(`Error deleting user with id ${userId}: ${error.message}`)
        res.status(500).json({ msg: error.message });
    }
})


module.exports = router