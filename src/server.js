const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
const PORT = 5000

app.use(cors())
app.use(express())

mongoose.connect('mongodb://127.0.0.1:27017/ingfoleh', {
})
    .then(() => {
        console.log("MongoDb Konek")
    })
    .catch(err => {
        console.error("mongoDb no conn", err)
    })

app.get('/', (req, res) => {
    res.send("Hello World")
    console.log("server is running...")
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);

})
