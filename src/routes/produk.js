const express = require('express');
const router = express.Router();
const Produk = require('../models/Produk');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateProductInput } = require('../middleware/validationMiddleware');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');
//create produk hanya admin
router.post('/', authenticateToken, authorizeRoles('admin'), validateProductInput, async (req, res, next) => {
    console.log("Request Body:", req.body);
    try {
        const produk = new Produk(req.body);
        await produk.save();
        logger.info(`Product created successfully: ${produk._id}`);
        return res.status(201).json(produk);
    } catch (error) {
        logger.error(`Error creating product: ${error.message}`);
        next(new AppError(error.message, 400));
    }
});


// read semua
router.get('/', async (req, res, next) => {
    try {
        const produk = await Produk.find()
        logger.info(`Fetched ${produk.length} products`)
        res.json(produk)
    } catch (error) {
        logger.error(`Error fetching products: ${error.message}`)
        next(new AppError(error.message, 500))
    }
})

// update produk hanya admin
router.put('/:id', authenticateToken, authorizeRoles('admin'), validateProductInput, async (req, res, next) => {
    console.log("Update Request Body:", req.body);
    try {
        const produk = await Produk.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!produk) {
            logger.warn(`Product with id ${req.params.id} not found`)
            return next(new AppError('Produk tidak ditemukan', 404))
        }
        logger.info(`Product updated successfully: ${produk._id}`)
        res.json(produk)
    } catch (error) {
        logger.error(`Error updating product: ${error.message}`)
        next(new AppError(error.message, 400))
    }
})

// Dlete produk hanya admin
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res, next) => {
    try {
        const produk = await Produk.findByIdAndDelete(req.params.id)
        if (!produk) {
            logger.warn(`Product with id ${req.params.id} not found`)
            return next(new AppError('Produk tidak ditemukan', 404))
        }
        logger.info(`Product successfully deleted: ${produk._id}`)
        res.json({ msg: 'Produk berhasil dihapus' })
    } catch (error) {
        logger.error(`Error deleting product with ID ${req.params.id}: ${error.message}`)
        next(new AppError(error.message, 500));
    }
});

module.exports = router;
