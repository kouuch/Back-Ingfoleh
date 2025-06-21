const mongoose = require('mongoose');

const produkSchema = new mongoose.Schema({
    kabupaten_kota: {
        type: String,
        required: true
    },
    nama_produk:{
        type: String,
        required: true
    },
    kategori: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Kategori',  
        required: true
    },
    lokasi_penjual:{
        type: String,
        required: true
    },
    kontak_penjual:{
        type: String,
        required: true
    },
    kisaran_harga:{
        type: Number,
        required: true
    },
    foto:{
        type: String,
        required: true
    }
},{timestamps: true})

module.exports = mongoose.model('Produk', produkSchema)