const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/ingfoleh', {
})
    .then(() => {
        console.log("MongoDb Konek")
    })
    .catch(err => {
        console.error("mongoDb no conn", err)
    })

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const produkRoutes = require('./routes/produk');
app.use('/api/produk', produkRoutes);

app.get('/', (req, res) => {
    res.send("Hello World")
    console.log("server is running...")
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);

})
