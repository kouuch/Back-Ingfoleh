const mongoose = require('mongoose');

const kategoriFavoritSchema = new mongoose.Schema({
    id_kategori: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Kategori',
        required: true
    },
    nama_kategori: {
        type: String,
        required: true
    },
    id_produk: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produk',  
        required: true
    },
    nama_produk: {
        type: String,
        required: true
    },
    jumlah_favorit: {
        type: Number,
        default: 0
    },
    user_id: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: true,
    }
},{ timestamps: true });

module.exports = mongoose.model('KategoriFavorit', kategoriFavoritSchema);