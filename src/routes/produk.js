const express = require('express');
const router = express.Router();
const Produk = require('../models/Produk');
const Kategori = require('../models/Kategori');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateProductInput } = require('../middleware/validationMiddleware');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');
const upload = require('../utils/upload');  // Pastikan path ini sesuai dengan struktur proyek Anda

//create produk hanya admin
// Endpoint untuk menambahkan produk baru (hanya admin)
// Endpoint untuk menambahkan produk baru dengan foto
router.post('/admincreate', authenticateToken, authorizeRoles('admin'), upload.single('foto'), async (req, res, next) => {
    try {
        // Mengambil data dari body request
        const { kabupaten_kota, nama_produk, kategori, lokasi_penjual, kontak_penjual, kisaran_harga } = req.body;

        // Mendapatkan nama file gambar dari req.file.filename
        const fotoPath = `/uploads/${req.file.filename}`;  // Menambahkan prefix '/uploads/' untuk path gambar

        // Membuat objek produk baru
        const newProduct = new Produk({
            kabupaten_kota,
            nama_produk,
            kategori,
            lokasi_penjual,
            kontak_penjual,
            kisaran_harga,
            foto: fotoPath  // Simpan path relatif di database
        });

        // Simpan produk ke database
        await newProduct.save();
        res.status(201).json({ message: 'Produk berhasil ditambahkan' });
    } catch (error) {
        console.error(error);
        next(error);  // Menangani error dengan middleware
    }
});

// Mengambil produk beserta nama kategori
router.get('/adminget', async (req, res, next) => {
    try {
        const produk = await Produk.find()
            .populate('kategori', 'nama_kategori')  // Mengambil nama kategori dari model Kategori
            .exec();

        // Pastikan path gambar yang dikirimkan sudah benar
        const produkWithImagePath = produk.map(p => ({
            ...p.toObject(),
            foto: p.foto  // Menggunakan path gambar yang sudah benar
        }));

        logger.info(`Fetched ${produk.length} products`);
        res.json(produkWithImagePath);  // Mengirimkan produk dengan kategori dan path gambar yang benar
    } catch (error) {
        logger.error(`Error fetching products: ${error.message}`);
        next(new AppError(error.message, 500));
    }
});



// update produk hanya admin
router.put('/adminupdate/:id', authenticateToken, authorizeRoles('admin'), validateProductInput, async (req, res, next) => {
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
router.delete('/delete/:id', authenticateToken, authorizeRoles('admin'), async (req, res, next) => {
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



// Endpoint untuk mengambil produk dengan paginasi
router.get('/products', async (req, res) => {
    try {
        const { category, page = 1 } = req.query;
        const productsPerPage = 8;
        const skip = (page - 1) * productsPerPage;

        const query = category ? { kategori: category } : {};
        const products = await Produk.find(query)
            .skip(skip)
            .limit(productsPerPage)
            .populate('kategori', 'nama_kategori');  // Pastikan kategori di-populate

        const totalProducts = await Produk.countDocuments(query);

        // Kirim data dalam format yang benar
        res.json({
            products: products,  // Pastikan products adalah array
            totalProducts: totalProducts
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});




// Menampilkan produk berdasarkan halaman
router.get('/', async (req, res) => {
    const { page = 1, limit = 6 } = req.query;
    const skip = (page - 1) * limit;
    try {
        const products = await Produk.find().skip(skip).limit(parseInt(limit));
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// menampilkan produk berdasarkan ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Produk.findById(id);
        if (!product) return res.status(404).send('Product not found');
        res.json(product);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});






module.exports = router;
