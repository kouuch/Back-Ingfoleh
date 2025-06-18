require('dotenv').config()
const express = require('express')
const path = require('path');
const cors = require('cors')
const mongoose = require('mongoose')
const rateLimit = require('express-rate-limit')
const logger = require('./utils/logger')

const app = express()
const PORT = process.env.PORT || 5000

app.use((req, res, next) => {
    logger.info(`Received request: ${req.method} ${req.url}`);
    console.log(`Request URL: ${req.url}`);
    next()
})

// file statis
app.use(express.static(path.join(__dirname, '..', 'ui', 'assets')))
// Menyajikan folder images sebagai folder statis agar gambar dapat diakses
app.use('/images', express.static('images'));

// set EJS as view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '..', 'ui', 'page'))

// CSP
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; " +
        "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net https://unpkg.com data:; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net https://unpkg.com; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com; " +
        "img-src 'self' data:;"
    );
    next();
});

// route utama
app.get('/', (req, res) => {
    logger.info("Rendering index page");
    try {
        res.render('index', { name: 'kyyy' });
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


app.use(cors())
app.use(express.json())

// konfigurasi raate limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Terlalu banyak permintaan, coba lagi nanti.",
})

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
app.use('/api/produk', produkRoutes);

// route untuk user
const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

// route untuk feedback
const feedbackRoutes = require('./routes/feedback');
app.use('/api/feedback', feedbackRoutes);

// route untuk kategori favorit
const kategoriFavoritRoutes = require('./routes/kategoriFavorit');
app.use('/api/kategoriFavorit', kategoriFavoritRoutes);

// route untuk toko
const tokoRoutes = require('./routes/toko');
app.use('/api/toko', tokoRoutes);

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
