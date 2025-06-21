const express = require('express');
const router = express.Router();
const kategori = require('../models/Kategori');
const Produk = require('../models/Produk');
const KategoriFavorit = require('../models/KategoriFavorit');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

// get laporan kategori favorit (admin only)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res, next) => {
    try {
        const data = await KategoriFavorit.find()
        res.json(data)
    } catch (error) {
        logger.error(`Error fetching kategori favorit: ${error.message}`);
        next(new AppError(error.message, 500))
    }
})

// Menambahkan atau menghapus produk dari favorit (POST/DELETE)
// Menambahkan produk ke favorit
router.post('/', authenticateToken, async (req, res) => {
    const { id_produk, nama_produk, id_kategori, nama_kategori } = req.body;
    const userId = req.user.id;

    try {
        // Validasi data
        if (!id_produk || !nama_produk || !id_kategori || !nama_kategori) {
            return res.status(400).json({ message: 'Product data is incomplete' });
        }

        // Cek apakah produk sudah ada di favorit
        const existingFavorit = await KategoriFavorit.findOne({ id_produk, userId });
        if (existingFavorit) {
            return res.status(400).json({ message: 'Produk sudah ada di favorit' });
        }

        // Menambahkan produk ke favorit
        const favorit = new KategoriFavorit({
            id_produk,
            nama_produk,
            id_kategori,
            nama_kategori,
            userId
        });

        await favorit.save();
        res.status(201).json({ message: 'Produk berhasil ditambahkan ke favorit', favoriteId: favorit._id });
    } catch (error) {
        console.error('Error adding to favorites:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});



// Menghapus produk dari favorit
// Menghapus produk dari favorit berdasarkan _id favorit
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;  // Mengambil _id favorit dari parameter URL
    try {
        const favorit = await KategoriFavorit.findByIdAndDelete(id);

        if (!favorit) {
            return res.status(404).json({ message: 'Favorit tidak ditemukan' }); // Kirimkan pesan dalam format JSON
        }

        res.status(200).json({ message: 'Produk berhasil dihapus dari favorit' }); // Response dalam JSON
    } catch (error) {
        console.error('Error deleting from favorites:', error);
        res.status(500).json({ message: 'Server Error' }); // Response dalam JSON
    }
});


module.exports = router;




D:\BELL\Back Ingfoleh\ui\assets\js\main.js
// swiper initialization
var swiper = new Swiper(".home", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});

// Heart toggle function
function toggleHeart(element) {
    if (element.classList.contains('bx-heart')) {
        element.classList.remove('bx-heart');
        element.classList.add('bxs-heart');
    } else {
        element.classList.remove('bxs-heart');
        element.classList.add('bx-heart');
    }
}

// Document loaded event
document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.navbar a');
    const sections = document.querySelectorAll('section');

    // Scroll to section function
    function scrollToSection(target) {
        if (!target) return;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    // Hash update function
    function updateHash(targetId) {
        history.pushState(null, null, targetId);
    }

    // Remove and Add active class on menu items
    function removeActiveClass() {
        menuItems.forEach(item => item.classList.remove('home-active'));
    }

    function addActiveClass(item) {
        item.classList.add('home-active');
    }

    // Highlight navbar on scroll
    function highlightNavbarOnScroll() {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 50;
            const sectionHeight = section.offsetHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                currentSectionId = `#${section.id}`;
            }
        });

        if (currentSectionId) {
            removeActiveClass();
            const activeItem = document.querySelector(`.navbar a[href="${currentSectionId}"]`);
            if (activeItem) {
                addActiveClass(activeItem);
                updateHash(currentSectionId);
            }
        }
    }

    // Throttle scroll event
    function throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function () {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function () {
                    if (Date.now() - lastRan >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    // Apply throttle to scroll event
    window.addEventListener('scroll', throttle(highlightNavbarOnScroll, 100));

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                scrollToSection(target);
                updateHash(targetId);
                removeActiveClass();
                addActiveClass(item);
            }
        });
    });
});

// Menu login check
window.onload = function () {
    const token = localStorage.getItem('token')

    if (token) {
        document.getElementById('guestMenu').style.display = 'none';
        document.getElementById('profileMenu').style.display = 'block';
    } else {
        document.getElementById('guestMenu').style.display = 'block';
        document.getElementById('profileMenu').style.display = 'none';
    }
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

// Handle the 'Lihat Semua' button click
document.getElementById('showProductsBtn').addEventListener('click', function () {
    if (isLoggedIn()) {
        // User is logged in, show the overlay
        document.getElementById('overlay').style.display = 'block';

        // Update URL hash to '/allproducts' when 'Lihat Semua' is clicked
        history.pushState(null, null, '/allproducts');
    } else {

        showLoginPopup();
    }
});





// Show login popup
function showLoginPopup() {
    document.getElementById('loginPrompt').style.display = 'flex';
}

// Close login popup
document.getElementById('closePopup').addEventListener('click', function () {
    document.getElementById('loginPrompt').style.display = 'none';
});

// Logout function
// Logout function
// Fungsi logout
document.getElementById('logoutBtn').addEventListener('click', function () {
    localStorage.removeItem('token');
    localStorage.removeItem('favorite_');  // Menghapus semua produk favorit
    localStorage.removeItem('favoriteId_');  // Menghapus semua favoriteId produk
    // Hapus semua item favorit produk berdasarkan produk ID
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('favorite_') || key.startsWith('favoriteId_')) {
            localStorage.removeItem(key);
        }
    });

    // Clear other user session data
    localStorage.removeItem('user_id'); // Jika user_id disimpan di localStorage

    // Redirect ke halaman utama setelah logout
    window.location.href = '/';
});








// button navigation
document.getElementById('showProductsBtn').addEventListener('click', () => {
    document.getElementById('overlay').style.display = 'block';
    // Dapatkan produk pertama atau favorit
    fetch('/api/products')
        .then(response => response.json())
        .then(products => displayProducts(products));
});

// Function to close overlay when clicking the close button (X)
document.getElementById('closeOverlayBtn').addEventListener('click', function () {
    // Menyembunyikan overlay
    document.getElementById('overlay').style.display = 'none';

    // Menghapus data favorit di localStorage
    localStorage.removeItem('favorite_');  // Menghapus semua produk favorit
    localStorage.removeItem('favoriteId_');  // Menghapus semua favoriteId produk

    // Reset URL hash ke '/'
    history.pushState(null, null, '/');
});

D:\BELL\Back Ingfoleh\ui\assets\js\fetchProducts.js
const productsPerPage = 8;
let currentPage = 1; // Halaman saat ini
let totalPages = 2;  // Total halaman (sesuaikan dengan data API)

// Fungsi untuk mengambil produk berdasarkan kategori dan halaman
function fetchProducts(page = 1, category = '') {
    const url = category ? `/api/products?category=${category}&page=${page}` : `/api/products?page=${page}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && Array.isArray(data.products)) {
                displayProducts(data);  // Tampilkan produk yang diterima
                totalPages = Math.ceil((data.totalProducts || 0) / productsPerPage); // Hitung total halaman
                updatePagination();  // Update pagination setelah produk diterima
            } else {
                console.error("Invalid data format: 'products' is not an array or missing.");
                displayProducts([]);  // Tampilkan pesan bahwa tidak ada produk
            }
        })
        .catch(error => console.error('Error fetching products:', error));
}

// Function to load user's favorites after login
// Function to load user's favorites after login
function loadUserFavorites() {
    const userId = localStorage.getItem('user_id'); // Pastikan ID pengguna diambil dari localStorage setelah login
    if (userId) {
        fetch(`/api/kategoriFavorit?user_id=${userId}`)
            .then(response => response.json())
            .then(favorites => {
                // Update tampilan berdasarkan favorit pengguna
                console.log(favorites);
            })
            .catch(error => console.error('Error loading favorites:', error));
    }
}






    function displayProducts(data) {
        const products = data.products || [];  // Pastikan kita mendapatkan array produk
        console.log('Products:', products);
        if (!Array.isArray(products) || products.length === 0) {
            const container = document.getElementById('productsContainer');
            container.innerHTML = "<p>No products available.</p>";
            return;
        }

        const container = document.getElementById('productsContainer');
        container.innerHTML = '';

        products.forEach(product => {
            // Pastikan kategori ada dalam data produk
            const categoryName = product.kategori ? product.kategori.nama_kategori : 'Kategori Tidak Ditemukan';
            const categoryId = product.kategori ? product.kategori._id : '';  // Pastikan kategori ada

            // Mengambil status favorit di localStorage
            const isFavorited = localStorage.getItem(`favorite_${product._id}`) === 'true';  // Mengambil status favorit
            const favoriteId = localStorage.getItem(`favoriteId_${product._id}`);  // Mengambil favoriteId

            const productCard = document.createElement('div');
            productCard.classList.add('box');
            productCard.innerHTML = `
            <img src="${product.foto}" alt="Product Image">
            <span>${categoryName}</span>  <!-- Menampilkan nama kategori -->
            <h2>${product.nama_produk}</h2>
            <h3 class="price">kisaran : Rp ${product.kisaran_harga}</h3>
            <h6><i class='bx bx-buildings'></i>${product.kabupaten_kota}</h6>
            <a href="https://maps.app.goo.gl/TF1mdkSz2HVMcn1y7" target="_blank">
                <i class='bx bx-map'></i>
            </a>
            <!-- Mengirimkan product._id sebagai productId ke fungsi toggleHeart -->
            <i class='bx ${isFavorited ? 'bxs-heart' : 'bx-heart'}' onclick="toggleHeart(this, '${product._id}', '${product.nama_produk}', '${categoryId}', '${categoryName}');"></i>
        `;
            container.appendChild(productCard);
        });
    }




    // Fungsi untuk memperbarui pagination (Prev/Next)
    function updatePagination() {
        const prevButton = document.querySelector('.prev-btn');
        const nextButton = document.querySelector('.next-btn');
        const pageNumbers = document.querySelector('.page-numbers');

        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;

        pageNumbers.innerHTML = `Halaman ${currentPage} dari ${totalPages}`;
    }

    // Fungsi untuk menangani klik tombol prev dan next
    document.querySelector('.prev-btn').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchProducts(currentPage);
        }
    });

    document.querySelector('.next-btn').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchProducts(currentPage);
        }
    });

    // Heart toggle function
    // Fungsi untuk toggle favorite
    // Heart toggle function
    function toggleHeart(element, productId, productName, productCategoryId, productCategoryName) {
        const token = localStorage.getItem('token');  // Ambil token yang valid dari localStorage
        if (!token) {
            alert("You need to log in to add products to your favorites.");
            return;
        }

        const isFavorited = element.classList.contains('bxs-heart');  // Cek apakah produk sudah di-favoritkan atau belum
        const favoriteId = localStorage.getItem(`favoriteId_${productId}`);  // Ambil favoriteId yang valid

        const url = isFavorited ? `/api/kategoriFavorit/${favoriteId}` : '/api/kategoriFavorit'; // URL untuk POST atau DELETE

        const productData = {
            id_produk: productId,  // Menggunakan _id produk yang valid
            nama_produk: productName,
            id_kategori: productCategoryId,  // ID kategori produk
            nama_kategori: productCategoryName,  // Nama kategori produk
        };

        const options = {
            method: isFavorited ? 'DELETE' : 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: !isFavorited ? JSON.stringify(productData) : undefined // Hanya kirim body pada POST request
        };

        fetch(url, options)
            .then(response => response.json()) // Pastikan menerima response dalam format JSON
            .then(data => {
                if (isFavorited) {
                    element.classList.remove('bxs-heart');
                    element.classList.add('bx-heart');
                    console.log('Produk berhasil dihapus dari favorit');
                    localStorage.setItem(`favorite_${productId}`, 'false');  // Menandakan produk tidak difavoritkan
                    localStorage.removeItem(`favoriteId_${productId}`); // Menghapus favoriteId dari localStorage
                } else {
                    element.classList.remove('bx-heart');
                    element.classList.add('bxs-heart');
                    console.log('Produk berhasil ditambahkan ke favorit');
                    localStorage.setItem(`favorite_${productId}`, 'true');  // Menandakan produk difavoritkan
                    localStorage.setItem(`favoriteId_${productId}`, data.favoriteId);  // Simpan favoriteId
                }
            })
            .catch(error => {
                console.error('Error toggling favorite:', error);
                alert(`Terjadi kesalahan: ${error.message}`); // Menampilkan pesan kesalahan
            });
    }



    // Mengambil favorit saat login
    function checkFavoriteStatus(productId) {
        const favoriteStatus = localStorage.getItem(`favorite_${productId}`);
        if (favoriteStatus === 'true') {
            // Set heart icon to "favorited" (bxs-heart)
            document.querySelector(`#heart-icon-${productId}`).classList.add('bxs-heart');
        } else {
            // Set heart icon to "not favorited" (bx-heart)
            document.querySelector(`#heart-icon-${productId}`).classList.remove('bxs-heart');
        }
    }

    // Toggle menu for dropdown
    let subMenu = document.getElementById("subMenu");
    const reportMenu = document.getElementById('reportMenu');
    const productsMenu = document.getElementById('productsMenu');

    const reportSubMenu = document.getElementById('reportSubMenu');
    const productsSubMenu = document.getElementById('productsSubMenu');

    function toggleMenu(element) {
        if (element.classList.contains('bx-caret-down')) {
            element.classList.remove('bx-caret-down');
            element.classList.add('bx-caret-up');
        } else {
            element.classList.remove('bx-caret-up');
            element.classList.add('bx-caret-down');
        }

        subMenu.classList.toggle("open-menu");

        if (!subMenu.classList.contains("open-menu")) {
            reportSubMenu.classList.remove('open-menu-sub');
            productsSubMenu.classList.remove('open-menu-sub');
        }
    }

    reportMenu.addEventListener('click', e => {
        e.preventDefault();

        productsSubMenu.classList.remove('open-menu-sub');

        reportSubMenu.classList.toggle('open-menu-sub');
    });

    productsMenu.addEventListener('click', e => {
        e.preventDefault();

        reportSubMenu.classList.remove('open-menu-sub');

        productsSubMenu.classList.toggle('open-menu-sub');
    });

    // Mengambil dan menampilkan produk default (misalnya produk populer atau terbaru)
    fetchProducts(currentPage);  // Menampilkan halaman pertama secara default


D:\BELL\Back Ingfoleh\src\middleware\auth.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { log, Logger } = require('winston');
const logger = require('../utils/logger');
const JWT_SECRET = process.env.JWT_SECRET


// verifikasi token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        logger.warn('Token tidak ditemukan');
        return next(new AppError('Token tidak ditemukan', 401));
    }

    logger.info('Verifying token: ', token);  // Debugging: log token yang diterima

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            logger.error(`Token tidak valid atau expired: ${err.message}`);
            return next(new AppError('Token tidak valid atau expired', 403));
        }
        req.user = user;
        next();
    });
}


// middleware cek role user

function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            logger.warn('User belum terautentikasi')
            return next(new AppError('User belum terautentikasi', 401))
        }
        if (allowedRoles.includes(req.user.role)) {
            next()
        } else {
            logger.warn(`Akses ditolak: Role ${req.user.role} tidak cukup untuk mengakses resource ini`)
            return next(new AppError('Akses ditolak: Role tidak cukup', 403))
        }
    }
}


module.exports = { authenticateToken, authorizeRoles };

D:\BELL\Back Ingfoleh\ui\assets\js\login.js
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

const signupFormContainer = document.getElementById('signupFormContainer');
const loginFormContainer = document.getElementById('loginFormContainer');

// Mengatur transisi saat tombol "Masuk" diklik
signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
    signupFormContainer.style.display = 'block';
    loginFormContainer.style.display = 'none';

    // Ganti URL ke /register tanpa reload halaman
    history.pushState(null, '', '/register');
});

// Mengatur transisi saat tombol "Daftar" diklik
signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
    signupFormContainer.style.display = 'none';
    loginFormContainer.style.display = 'block';

    // Ganti URL ke /login tanpa reload halaman
    history.pushState(null, '', '/login');
});

// Mengecek URL saat halaman dimuat untuk menentukan form yang harus ditampilkan
window.addEventListener('load', () => {
    const signupFormContainer = document.getElementById('signupFormContainer');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const container = document.getElementById('container');

    if (window.location.pathname === "/register") {
        container.classList.add("right-panel-active");
        signupFormContainer.style.display = 'block';
        loginFormContainer.style.display = 'none';
    } else {
        container.classList.remove("right-panel-active");
        signupFormContainer.style.display = 'none';
        loginFormContainer.style.display = 'block';
    }
});



// Login
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const emailOrUsername = loginForm.querySelector('input[type="text"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emailOrUsername, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user_id', data.userId);
            window.location.href = '/';
        } else {
            alert('Login gagal: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Login gagal, coba lagi');
    });
});

// Register
const signUpForm = document.querySelector('.sign-up-container form');
signUpForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.msg === "Registrasi Berhasil") {
            localStorage.setItem('token', data.token);
            window.location.href = '/';
        } else {
            alert('Registrasi gagal: ' + data.msg);
        }
    })
    .catch(error => {
        console.error('Registrasi gagal:', error);
        alert('Registrasi gagal: ' + (error.message || 'Coba lagi nanti'));
    });
});

D:\BELL\Back Ingfoleh\src\routes\kategoriFavorit.js
const express = require('express');
const router = express.Router();
const KategoriFavorit = require('../models/KategoriFavorit');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

// Get laporan kategori favorit (admin only)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res, next) => {
    try {
        const data = await KategoriFavorit.find()
            .populate('id_produk')  // Mengisi detail produk
            .exec();
        res.json(data);
    } catch (error) {
        logger.error(`Error fetching kategori favorit: ${error.message}`);
        next(new AppError(error.message, 500));
    }
});

// Menambahkan produk ke favorit (Hanya pengguna yang terautentikasi)
// Menambahkan produk ke favorit
// Menambahkan produk ke favorit (Hanya pengguna yang terautentikasi)
router.post('/', authenticateToken, async (req, res) => {
    const { id_produk, nama_produk, id_kategori, nama_kategori } = req.body;
    const userId = req.user.id;  // Mengambil userId dari token yang sudah terautentikasi

    try {
        // Validasi data
        if (!id_produk || !nama_produk || !id_kategori || !nama_kategori) {
            return res.status(400).json({ message: 'Product data is incomplete' });
        }

        // Cek apakah produk sudah ada di favorit
        const existingFavorit = await KategoriFavorit.findOne({ id_produk, userId });
        if (existingFavorit) {
            return res.status(400).json({ message: 'Produk sudah ada di favorit' });
        }

        // Menambahkan produk ke favorit, pastikan user_id ada
        const favorit = new KategoriFavorit({
            id_produk,
            nama_produk,
            id_kategori,
            nama_kategori,
            user_id: userId  // Menambahkan user_id ke data favorit
        });

        await favorit.save();
        res.status(201).json({ message: 'Produk berhasil ditambahkan ke favorit', favoriteId: favorit._id });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});







// Mengambil daftar produk favorit berdasarkan user_id (untuk pengguna yang terautentikasi)
// Mengambil produk favorit berdasarkan user_id
// Mengambil daftar produk favorit berdasarkan user_id
// Mengambil daftar produk favorit berdasarkan user_id
router.get('/', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        // Pastikan untuk selalu memeriksa userId saat mengambil data favorit
        const favorit = await KategoriFavorit.find({ user_id: userId })
            .populate('id_produk')
            .exec();

        if (!favorit || favorit.length === 0) {
            logger.warn(`Tidak ada produk favorit untuk user ${userId}`);
            return res.status(404).send('Tidak ada produk favorit');
        }

        logger.info(`Produk favorit untuk user ${userId} berhasil diambil`);
        res.status(200).json(favorit);  // Kirimkan produk favorit sesuai userId
    } catch (error) {
        logger.error(`Error fetching favorites: ${error.message}`);
        res.status(500).send('Server Error');
    }
});




// Menghapus produk dari favorit berdasarkan _id favorit
// Menghapus produk dari favorit berdasarkan _id favorit
// Menghapus produk favorit berdasarkan user_id dan favoriteId
// Menghapus produk dari favorit berdasarkan user_id dan favoriteId
// Menghapus produk dari favorit berdasarkan _id favorit dan memastikan user_id yang cocok
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;  // Mengambil _id favorit dari parameter URL
    const userId = req.user.id; // Mendapatkan user_id dari token yang terautentikasi

    try {
        // Cari favorit yang dimiliki oleh user yang sedang login
        const favorit = await KategoriFavorit.findOne({ _id: id, user_id: userId });

        if (!favorit) {
            logger.warn(`Favorit dengan id ${id} tidak ditemukan atau tidak milik user ${userId}`);
            return res.status(404).json({ message: 'Favorit tidak ditemukan atau tidak milik user yang sedang login' });
        }

        // Menghapus favorit
        await KategoriFavorit.findByIdAndDelete(id);
        logger.info(`Produk dengan id ${favorit.id_produk} berhasil dihapus dari favorit oleh user ${userId}`);
        res.status(200).json({ message: 'Produk berhasil dihapus dari favorit' });
    } catch (error) {
        logger.error(`Error deleting from favorites: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
});




module.exports = router;


