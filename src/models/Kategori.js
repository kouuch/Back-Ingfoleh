const mongoose = require('mongoose');


const kategoriSchema = new mongoose.Schema({
    nama_kategori: {
        type: String,
        required: true, 
        unique: true     
    }
}, { timestamps: true });  

module.exports = mongoose.model('Kategori', kategoriSchema);
