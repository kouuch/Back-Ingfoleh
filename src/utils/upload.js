const multer = require('multer');
const path = require('path');
const logger = require('./logger');

// Menentukan penyimpanan file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder untuk menyimpan file
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Menyimpan file dengan nama unik berdasarkan timestamp
    }
});

// Filter untuk menerima hanya file gambar
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        logger.info(`File uploaded: ${file.originalname}`); // Log nama file yang diupload
        cb(null, true); // Terima file gambar
    } else {
        cb(new Error('Only image files are allowed!'), false); // Tolak file bukan gambar
    }
};

// Inisialisasi multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Batasi ukuran file maksimal 5MB
});

module.exports = upload;
