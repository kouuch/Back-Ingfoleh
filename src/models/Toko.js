const mongoose = require('mongoose');

const tokoSchema = new mongoose.Schema({
    nama_toko: {
        type: String,
        required: true
    },
    kabupaten_kota: {
        type: String,
        required: true
    },
    alamat_lengkap:{
        type: String,
        required: true
    },
    kontak_toko: {
        type: String,
        required: true
    }
},{timestamps: true})

module.exports = mongoose.model('Toko', tokoSchema);