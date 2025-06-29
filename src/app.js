require('dotenv').config()
const express = require('express')
const path = require('path');
const cors = require('cors')
const mongoose = require('mongoose')
const rateLimit = require('express-rate-limit')
const logger = require('./utils/logger')
const { authenticateToken, authorizeRoles } = require('./middleware/auth')

const app = express()
const PORT = process.env.PORT || 5000

app.use((req, res, next) => {
    logger.info(`Received request: ${req.method} ${req.url}`);
    console.log(`Request URL: ${req.url}`);
    next()
})

// file statis
app.use(express.static(path.join(__dirname, '..', 'ui', 'assets')))
// Menyajikan folder images
app.use('/images', express.static('images'));
// Menyajikan folder uploads yang ada di src/utils
app.use('/uploads', express.static(path.join(__dirname, '..','src', 'utils', 'uploads')));


// set EJS as view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '..', 'ui', 'page'))


// CSP
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; " +
        "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com data:; " +  // Menambahkan cdn.cloudflare.com untuk font dan data: untuk base64 font
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com; " +  // Menambahkan cdn.cloudflare.com untuk stylesheet
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com https://code.jquery.com; " +  // Menambahkan cdn.cloudflare.com dan code.jquery.com untuk skrip
        "img-src 'self' https://images.pexels.com data:;"  // Memperbolehkan gambar dari Pexels
    );
    next();
});




// route utama
app.get('/', (req, res) => {
    logger.info("Rendering index page");
    try {
        res.render('index');
    } catch (err) {
        logger.error('Error rendering index:', err);
        res.status(500).send('Error rendering page');
    }
});

// Route untuk halaman login
app.get('/login', (req, res) => {
    logger.info("Rendering login page");
    try {
        res.render('login');
    } catch (err) {
        logger.error('Error rendering login:', err);
        res.status(500).send('Error rendering page');
    }
});

// Route untuk halaman registrasi
app.get('/register', (req, res) => {
    logger.info("Rendering register page");
    try {
        res.render('login');
    } catch (err) {
        logger.error('Error rendering register:', err);
        res.status(500).send('Error rendering page');
    }
});

// Route untuk halaman admin
app.get('/adminproduct', async (req, res) => {
    try {
        res.render('adminproduct'); // Render halaman adminproduct.ejs
    } catch (error) {
        logger.error('Error rendering admin products page:', error);
        res.status(500).send('Error rendering page');
    }
});
// Route untuk halaman toko
app.get('/admintoko', async (req, res) => {
    try {
        res.render('admintoko'); // Render halaman adminproduct.ejs
    } catch (error) {
        logger.error('Error rendering admin toko page:', error);
        res.status(500).send('Error rendering page');
    }
});
// Route untuk halaman Suka
app.get('/adminfavorite', async (req, res) => {
    try {
        res.render('adminfavorite'); // Render halaman adminproduct.ejs
    } catch (error) {
        logger.error('Error rendering admin Like page:', error);
        res.status(500).send('Error rendering page');
    }
});

// app.get('/adminproduct', authenticateToken, authorizeRoles('admin'), async (req, res) => {
//     try {
//         // Render halaman adminproduct.ejs hanya jika token valid dan user adalah admin
//         res.render('adminproduct');
//     } catch (error) {
//         logger.error('Error rendering admin products page:', error);
//         res.status(500).send('Error rendering page');
//     }
// });



// app.get('/adminproducts', authenticateToken, (req, res) => {
//     logger.warn('Halaman admin produk diakses tanpa otorisasi yang benar');    
//     console.log('Token diterima:', req.headers['authorization']);  // Log token yang diterima
//     res.send('Halaman produk admin');
// });


// Route untuk halaman admin
// app.get('/adminproducts', authenticateToken, async (req, res) => {
//     try {
//         res.render('adminproduct');  // Render halaman adminproduct.ejs
//     } catch (error) {
//         logger.error('Error rendering admin products page:', error);
//         res.status(500).send('Error rendering page');
//     }
// });


// //route untuk halaman admin
// const adminRoutes = require('./routes/admin');
// app.use('/api/admin', authenticateToken, authorizeRoles('admin'), adminRoutes);


app.use(cors({
    origin: 'http://localhost:3000',  // Ganti dengan URL frontend Anda
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']  // Pastikan Authorization diizinkan
}));
app.use(express.json())

// konfigurasi raate limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Terlalu banyak permintaan, coba lagi nanti.",
})

// Middleware untuk logging request
app.use((req, res, next) => {
    logger.info(`Received request: ${req.method} ${req.url}`);
    next();
});

app.use(limiter)

mongoose.connect(process.env.DB_URI
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
)
    .then(() => {
        logger.info("MongoDB berhasil terkoneksi")
    })
    .catch(err => {
        logger.error("Koneksi MongoDB gagal", err)
    })

// route untuk autentikasi
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// route untuk produk
const produkRoutes = require('./routes/produk');
app.use('/api', produkRoutes);

// route untuk user
const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

// route untuk feedback
const feedbackRoutes = require('./routes/feedback');
app.use('/api', feedbackRoutes);

// route untuk menceklike
const favoritesRoute = require('./routes/favorites');
app.use('/api/favorites', favoritesRoute);

// route untuk kategori favorit
const kategoriFavoritRoutes = require('./routes/kategoriFavorit');
app.use('/api/kategoriFavorit', kategoriFavoritRoutes);

// route untuk toko
const tokoRoutes = require('./routes/toko');
app.use('/api/toko', tokoRoutes);

// route untuk kategori 
const kategoriRoutes = require('./routes/kategori');
const AppError = require('./utils/AppError');
app.use('/api/kategori', kategoriRoutes);

// app.get('/', (req, res) => {
//     res.send("Hello World")
//     logger.info("server is running...")
// })

// Global error handling
app.use((err, req, res, next) => {
    logger.error(`Error occurred: ${err.message}`)

    // Respons standar untuk error
    res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
        errors: err.errors || [],
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    })
})


app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);

})
