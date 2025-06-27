const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['guest', 'user', 'admin'],
        default: 'user'
    },
    no_telepon: {
        type: String
    },
    status_akun: {
        type: String,
        enum: ['aktif', 'nonaktif'],
        default: 'aktif'
    },
    tanggal_daftar: {
        type: Date,
        default: Date.now
    },
    profilePicture: {
        type: String,
        default: '/images/userDefault/user.png'
    }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)