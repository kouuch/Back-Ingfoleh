// Fungsi untuk toggle menu (untuk dropdown)
function toggleMenu(element) {
    if (element.classList.contains('bx-caret-down')) {
        element.classList.remove('bx-caret-down');
        element.classList.add('bx-caret-up');
    } else {
        element.classList.remove('bx-caret-up');
        element.classList.add('bx-caret-down');
    }

    // Toggle submenu
    subMenu.classList.toggle("open-menu");

    if (!subMenu.classList.contains("open-menu")) {
        reportSubMenu.classList.remove('open-menu-sub');
        productsSubMenu.classList.remove('open-menu-sub');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let subMenu = document.getElementById("subMenu");
    const reportMenu = document.getElementById('reportMenu');
    const productsMenu = document.getElementById('productsMenu');

    const reportSubMenu = document.getElementById('reportSubMenu');
    const productsSubMenu = document.getElementById('productsSubMenu');

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
});


const productsPerPage = 8;
let currentPage = 1;
let totalPages = 2;

window.addEventListener('load', () => {
    loadFavoriteProducts();
});

function fetchProducts(page = 1, category = '') {
    const url = category ? `/api/products?category=${category}&page=${page}` : `/api/products?page=${page}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && Array.isArray(data.products)) {
                displayProducts(data);
                totalPages = Math.ceil((data.totalProducts || 0) / productsPerPage);
                updatePagination();
            } else {
                console.error("Invalid data format: 'products' is not an array or missing.");
                displayProducts([]);
            }
        })
        .catch(error => console.error('Error fetching products:', error));
}

// Function to load user's favorites after login
function loadFavoriteProducts() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log("User is not logged in.");
        return;
    }

    console.log('Fetching favorite products for token:', token);

    fetch('/api/kategoriFavorit/like', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(favorites => {
            displayFavorites(favorites);
            updateHeartStatus(favorites);
        })
        .catch(error => {
            console.error('Error loading favorites:', error);
            alert('Gagal mengambil data favorit');
        });
}

function updateHeartStatus(favorites) {
    console.log('Updating heart status based on fetched favorites');
    favorites.forEach(favorite => {
        const productId = favorite.id_produk._id;
        const isFavorited = true;
        const favoriteId = favorite._id;

        localStorage.setItem(`favorite_${productId}`, 'true');
        localStorage.setItem(`favoriteId_${productId}`, favoriteId);

        const heartIcon = document.querySelector(`#heart-icon-${productId}`);
        if (heartIcon) {
            console.log('Updating heart icon for product:', productId);
            heartIcon.classList.toggle('bxs-heart', isFavorited);
            heartIcon.classList.toggle('bx-heart', !isFavorited);
        }
    });
}

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

function displayProducts(data) {
    const products = data.products || [];
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';

    products.forEach(product => {
        const categoryName = product.kategori ? product.kategori.nama_kategori : 'Kategori Tidak Ditemukan';
        const categoryId = product.kategori ? product.kategori._id : '';

        const isFavorited = localStorage.getItem(`favorite_${product._id}`) === 'true';
        const favoriteId = localStorage.getItem(`favoriteId_${product._id}`);

        const productCard = document.createElement('div');
        productCard.classList.add('box');
        productCard.innerHTML = `
            <img src="${product.foto}" alt="Product Image">
            <span>${categoryName}</span>
            <h2>${product.nama_produk}</h2>
            <h3 class="price">kisaran : Rp ${product.kisaran_harga}</h3>
            <h6><i class='bx bx-buildings'></i>${product.kabupaten_kota}</h6>
            <a href="https://maps.app.goo.gl/TF1mdkSz2HVMcn1y7" target="_blank">
                <i class='bx bx-map'></i>
            </a>
            <i id="heart-icon-${product._id}" class='bx ${isFavorited ? 'bxs-heart' : 'bx-heart'}' onclick="toggleHeart(this, '${product._id}', '${product.nama_produk}', '${categoryId}', '${categoryName}');"></i>
        `;
        container.appendChild(productCard);
    });
}

function updatePagination() {
    const prevButton = document.querySelector('.prev-btn');
    const nextButton = document.querySelector('.next-btn');
    const pageNumbers = document.querySelector('.page-numbers');

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;

    pageNumbers.innerHTML = `Halaman ${currentPage} dari ${totalPages}`;
}

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

function toggleHeart(element, productId, productName, categoryId, categoryName) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("You need to log in to add products to your favorites.");
        return;
    }

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
                element.classList.remove('bxs-heart');
                element.classList.add('bx-heart');
                localStorage.setItem(`favorite_${productId}`, 'false');
                localStorage.removeItem(`favoriteId_${productId}`);
            } else {
                element.classList.remove('bx-heart');
                element.classList.add('bxs-heart');
                localStorage.setItem(`favorite_${productId}`, 'true');
                localStorage.setItem(`favoriteId_${productId}`, data.favoriteId);
            }
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
        document.querySelector(`#heart-icon-${productId}`).classList.add('bxs-heart');
    } else {
        document.querySelector(`#heart-icon-${productId}`).classList.remove('bxs-heart');
    }
}

// Fungsi untuk logout
document.getElementById('logoutBtn').addEventListener('click', function () {

    localStorage.removeItem('token');
    localStorage.removeItem('favorite_');

    localStorage.removeItem('favoriteId_');
    localStorage.removeItem('profilePicture');
    localStorage.removeItem('role');
    localStorage.removeItem('userEmail');

    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('favorite_') || key.startsWith('favoriteId_')) {
            localStorage.removeItem(key);
        }
    });

    window.location.href = '/';
});


fetchProducts(currentPage);  
