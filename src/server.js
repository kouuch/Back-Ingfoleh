const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/ingfoleh', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("MongoDb Konek")
    })
    .catch(err => {
        console.error("mongoDb no conn", err)
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

app.get('/', (req, res) => {
    res.send("Hello World")
    console.log("server is running...")
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);

})
