const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const rateLimit = require('express-rate-limit')
const logger = require('./utils/logger')

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

// konfigurasi raate limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Terlalu banyak permintaan, coba lagi nanti.",
})

app.use(limiter)

mongoose.connect('mongodb://127.0.0.1:27017/ingfoleh'
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

app.get('/', (req, res) => {
    res.send("Hello World")
    logger.info("server is running...")
})

app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);

})
