const multer = require('multer');
const path = require('path');

// Setup multer untuk menyimpan file di folder 'uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));  // Pastikan folder 'uploads' benar
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Menyimpan file dengan nama unik
    }
});


const upload = multer({ storage: storage });

module.exports = upload;
