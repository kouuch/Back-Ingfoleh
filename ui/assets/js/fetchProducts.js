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
// Fungsi untuk memuat produk favorit setelah login
// Fungsi untuk memuat produk favorit setelah login
// Fungsi untuk memuat produk favorit setelah login
function loadFavoriteProducts() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log("User is not logged in.");
        return;
    }

    fetch('/api/kategoriFavorit/like', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(favorites => {
        console.log('Favorites:', favorites);
        displayFavorites(favorites);  // Menampilkan data favorit
    })
    .catch(error => {
        console.error('Error loading favorites:', error);
        alert('Gagal mengambil data favorit');
    });
}

// Fungsi untuk menampilkan produk favorit di halaman
function displayFavorites(favorites) {
    const container = document.getElementById('favoritesContainer');
    container.innerHTML = '';

    favorites.forEach(favorite => {
        const favoriteCard = document.createElement('div');
        favoriteCard.classList.add('favorite-card');
        favoriteCard.innerHTML = `
            <h3>${favorite.nama_produk}</h3>
            <p>${favorite.nama_kategori}</p>
            <p>Jumlah Favorit: ${favorite.jumlah_favorit}</p>
        `;
        container.appendChild(favoriteCard);
    });
}



// Menampilkan produk favorit dengan jumlah favorit yang benar
function displayFavorites(favorites) {
    const container = document.getElementById('favoritesContainer');
    container.innerHTML = '';  // Bersihkan kontainer terlebih dahulu

    favorites.forEach(favorite => {
        const favoriteCard = document.createElement('div');
        favoriteCard.classList.add('favorite-card');
        favoriteCard.innerHTML = `
            <h3>${favorite.nama_produk}</h3>
            <p>${favorite.nama_kategori}</p>
            <p>Jumlah Favorit: ${favorite.jumlah_favorit}</p>
        `;
        container.appendChild(favoriteCard);
    });
}




// Saat menambahkan produk ke favorit
function toggleFavoriteStatus(productId, favoriteId) {
    localStorage.setItem(`favorite_${productId}`, 'true');
    localStorage.setItem(`favoriteId_${productId}`, favoriteId);
}

// Saat menghapus produk dari favorit
function removeFavoriteStatus(productId) {
    localStorage.removeItem(`favorite_${productId}`);
    localStorage.removeItem(`favoriteId_${productId}`);
}

// Mengambil status favorit dari localStorage saat login
function getFavoriteStatus(productId) {
    return localStorage.getItem(`favorite_${productId}`) === 'true';
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
// Fungsi untuk toggle status favorit produk
function toggleHeart(element, productId, productName, categoryId, categoryName) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("You need to log in to add products to your favorites.");
        return;
    }

    // Cek apakah produk sudah di-favoritkan
    const isFavorited = element.classList.contains('bxs-heart');
    const favoriteId = localStorage.getItem(`favoriteId_${productId}`);

    const url = isFavorited ? `/api/kategoriFavorit/${favoriteId}` : '/api/kategoriFavorit';

    const productData = {
        id_produk: productId,
        nama_produk: productName,
        id_kategori: categoryId,
        nama_kategori: categoryName,
    };

    const options = {
        method: isFavorited ? 'DELETE' : 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: !isFavorited ? JSON.stringify(productData) : undefined
    };

    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            if (isFavorited) {
                // Jika sudah di-favoritkan, hapus
                element.classList.remove('bxs-heart');
                element.classList.add('bx-heart');
                localStorage.setItem(`favorite_${productId}`, 'false');
                localStorage.removeItem(`favoriteId_${productId}`);
            } else {
                // Jika belum di-favoritkan, tambahkan
                element.classList.remove('bx-heart');
                element.classList.add('bxs-heart');
                localStorage.setItem(`favorite_${productId}`, 'true');
                localStorage.setItem(`favoriteId_${productId}`, data.favoriteId);
            }

            // Update jumlah favorit produk di UI
            updateProductFavoritCount(productId);
        })
        .catch(error => {
            console.error('Error toggling favorite:', error);
            alert(`Terjadi kesalahan: ${error.message}`);
        });
}




// Fungsi untuk update jumlah favorit produk di UI
function updateProductFavoritCount(productId) {
    const countElement = document.querySelector(`#product-${productId}-favorit-count`);
    if (countElement) {
        fetch(`/api/kategoriFavorit/count/${productId}`)
            .then(response => response.json())
            .then(data => {
                countElement.innerText = `Favorited: ${data.totalFavorit}`;
            })
            .catch(error => console.error('Error updating favorite count:', error));
    }
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
fetchProducts(currentPage); 