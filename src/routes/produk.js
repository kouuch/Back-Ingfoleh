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
        // Ambil data dari body request
        const { kabupaten_kota, nama_produk, kategori, lokasi_penjual, kontak_penjual, kisaran_harga } = req.body;

        // Ambil ObjectId kategori berdasarkan nama kategori
        const kategoriObj = await Kategori.findOne({ nama_kategori: kategori });

        if (!kategoriObj) {
            return res.status(400).json({ message: "Kategori tidak ditemukan" });
        }


        const fotoPath = `/uploads/${req.file.filename}`;

        // Membuat objek produk baru
        const newProduct = new Produk({
            kabupaten_kota,
            nama_produk,
            kategori: kategoriObj._id,
            lokasi_penjual,
            kontak_penjual,
            kisaran_harga,
            foto: fotoPath
        });


        await newProduct.save();
        res.status(201).json({ message: 'Produk berhasil ditambahkan' });
    } catch (error) {
        console.error("Error during product creation:", error);
        next(error);
    }
});




// Mengambil produk beserta nama kategori
router.get('/adminget', async (req, res, next) => {
    try {
        const produk = await Produk.find()
            .populate('kategori', 'nama_kategori')
            .exec();

        // Pastikan path gambar yang dikirimkan sudah benar
        const produkWithImagePath = produk.map(p => ({
            ...p.toObject(),
            foto: p.foto
        }));

        logger.info(`Fetched ${produk.length} products`);
        res.json(produkWithImagePath);
    } catch (error) {
        logger.error(`Error fetching products: ${error.message}`);
        next(new AppError(error.message, 500));
    }
});

// Mengupdate produk hanya untuk admin
router.put('/adminupdate/:id', authenticateToken, authorizeRoles('admin'), upload.single('foto'), async (req, res, next) => {
    try {
        let updatedFoto = req.body.foto;

        // Jika ada file baru yang diupload, ganti dengan file tersebut
        if (req.file) {
            updatedFoto = `/uploads/${req.file.filename}`;
        }

        const { kabupaten_kota, nama_produk, kategori, lokasi_penjual, kontak_penjual, kisaran_harga } = req.body;
        logger.warn(`Updating product with ID: ${req.params.id}`);
        console.log("Kategori yang diterima dari frontend:", kategori);

        // Mencari produk berdasarkan ID
        const produk = await Produk.findById(req.params.id);
        if (!produk) {
            return next(new AppError('Produk tidak ditemukan', 404));
        }

        // Cari ObjectId kategori berdasarkan nama kategori
        const kategoriObj = await Kategori.findOne({ nama_kategori: kategori });
        if (!kategoriObj) {
            return res.status(400).json({ message: "Kategori tidak ditemukan" });
        }

        // Update produk dengan data baru
        produk.kabupaten_kota = kabupaten_kota || produk.kabupaten_kota;
        produk.nama_produk = nama_produk || produk.nama_produk;
        produk.kategori = kategoriObj._id;
        produk.lokasi_penjual = lokasi_penjual || produk.lokasi_penjual;
        produk.kontak_penjual = kontak_penjual || produk.kontak_penjual;
        produk.kisaran_harga = kisaran_harga || produk.kisaran_harga;
        produk.foto = updatedFoto;

        // Simpan perubahan ke database
        await produk.save();
        res.status(200).json({ message: 'Produk berhasil diupdate', produk });
    } catch (error) {
        console.error(`Error updating product: ${error.message}`);
        next(new AppError(error.message, 400));
    }
});






// Mengambil produk berdasarkan ID untuk update
router.get('/products/:id', async (req, res, next) => {
    try {
        const produk = await Produk.findById(req.params.id)
            .populate('kategori', 'nama_kategori');

        if (!produk) {
            logger.warn(`Product with id ${req.params.id} not found`);
            return next(new AppError('Produk tidak ditemukan', 404));
        }

        res.status(200).json(produk);
    } catch (error) {
        logger.error(`Error fetching product with ID ${req.params.id}: ${error.message}`);
        console.error(`Error fetching product: ${error.message}`);
        next(new AppError(error.message, 400));
    }
});




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
            .populate('kategori', 'nama_kategori');

        const totalProducts = await Produk.countDocuments(query);

        res.json({
            products: products,
            totalProducts: totalProducts
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.get('/productskate', async (req, res) => {
    try {
        const { category, page = 1 } = req.query;
        const productsPerPage = 6;
        const skip = (page - 1) * productsPerPage;


        let query = {};


        if (category) {

            const kategoriObj = await Kategori.findOne({ nama_kategori: category });


            if (!kategoriObj) {
                return res.status(404).json({ message: 'Kategori tidak ditemukan' });
            }

            query = { kategori: kategoriObj._id };
        }

        // Ambil produk berdasarkan query kategori dengan pagination
        const products = await Produk.find(query)
            .skip(skip)
            .limit(productsPerPage)
            .populate('kategori', 'nama_kategori');

        // Ambil total produk untuk pagination
        const totalProducts = await Produk.countDocuments(query);

        res.json({
            products: products,
            totalProducts: totalProducts,
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
