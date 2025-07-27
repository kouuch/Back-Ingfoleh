require('dotenv').config()
const express = require('express')
const path = require('path');
const cors = require('cors')
const mongoose = require('mongoose')
const rateLimit = require('express-rate-limit')
const logger = require('./utils/logger')
const { authenticateToken, authorizeRoles } = require('./middleware/auth')
const cookieParser = require('cookie-parser')

const app = express()
const PORT = process.env.PORT || 5000
app.use(cookieParser())


app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json())

// konfigurasi raate limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Terlalu banyak permintaan, coba lagi nanti.",
})


app.use((req, res, next) => {
    logger.info(`Received request: ${req.method} ${req.url}`);
    next()
})

// Middleware untuk logging request
app.use((req, res, next) => {
    logger.info(`Received request: ${req.method} ${req.url}`);
    next();
});

// file statis
app.use(express.static(path.join(__dirname, '..', 'ui', 'assets')))
// Menyajikan folder images
app.use('/images', express.static('images'));
// Menyajikan folder uploads yang ada di src/utils
app.use('/uploads', express.static(path.join(__dirname, '..', 'src', 'utils', 'uploads')));

// set EJS as view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '..', 'ui', 'page'))

// CSP
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; " +
        "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com data:; " +  // Menambahkan cdn.jsdelivr.net untuk font dan data: untuk base64 font
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com https://stackpath.bootstrapcdn.com; " +  // Menambahkan stackpath.bootstrapcdn.com untuk stylesheet
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com https://cdnjs.cloudflare.com https://code.jquery.com; " +  // Menambahkan cdn.jsdelivr.net dan code.jquery.com untuk skrip
        "img-src 'self' https://images.pexels.com https://bootdey.com https://www.bootdey.com data:;"  // Memperbolehkan gambar dari Pexels dan Bootdey (dengan www)
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
app.get('/adminproduct', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        res.render('adminproduct');
    } catch (error) {
        logger.error('Error rendering admin products page:', error);
        res.status(500).send('Error rendering page');
    }
});
// Route untuk halaman toko
app.get('/admintoko', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        res.render('admintoko');
    } catch (error) {
        logger.error('Error rendering admin toko page:', error);
        res.status(500).send('Error rendering page');
    }
});
// Route untuk halaman Suka
app.get('/adminfavorite', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        res.render('adminfavorite');
    } catch (error) {
        logger.error('Error rendering admin Like page:', error);
        res.status(500).send('Error rendering page');
    }
});
// Route untuk halaman datauser
app.get('/datauser', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        res.render('datauser');
    } catch (error) {
        logger.error('Error rendering admin Like page:', error);
        res.status(500).send('Error rendering page');
    }
});
// Route untuk halaman profile
app.get('/profile', async (req, res) => {
    try {
        res.render('profile');
    } catch (error) {
        logger.error('Error rendering Profile page:', error);
        res.status(500).send('Error rendering page');
    }
})
// Route untuk halaman adminFeedback
app.get('/adminFeedback', async (req, res) => {
    try {
        res.render('adminFeedback');
    } catch (error) {
        logger.error('Error rendering adminFeedback page:', error);
        res.status(500).send('Error rendering page');
    }
})

// Route untuk halaman laporan Produk
app.get('/lapproduk', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        res.render('lapproduk');
    } catch (error) {
        logger.error('Error rendering laporan produk page:', error);
        res.status(500).send('Error rendering laporan page');
    }
})
// Route untuk halaman laporan datauser
app.get('/laporandatauser',authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        res.render('laporandatauser');
    } catch (error) {
        logger.error('Error rendering laporandatauser page:', error);
        res.status(500).send('Error rendering laporan page');
    }
})
// Route untuk halaman laporan favorite
app.get('/laaphoranadminfavorite',authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        res.render('laaphoranadminfavorite');
    } catch (error) {
        logger.error('Error rendering laaphoranadminfavorite page:', error);
        res.status(500).send('Error rendering laporan page');
    }
})

// Route untuk halaman laporan toko
app.get('/laporantoko',authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        res.render('laporantoko');
    } catch (error) {
        logger.error('Error rendering laporantoko page:', error);
        res.status(500).send('Error rendering laporan page');
    }
})

// Route untuk halaman laporan Feedback
app.get('/laporanFeedback',authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        res.render('laporanFeedback');
    } catch (error) {
        logger.error('Error rendering laporanFeedback page:', error);
        res.status(500).send('Error rendering laporanFeedback page');
    }
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
