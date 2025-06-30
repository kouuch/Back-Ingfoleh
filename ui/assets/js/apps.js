// Swiper Initialization
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

// Menu login check
window.onload = function () {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role) {
        document.getElementById('guestMenu').style.display = 'none';
        document.getElementById('profileMenu').style.display = 'block';
    } else {
        document.getElementById('guestMenu').style.display = 'block';
        document.getElementById('profileMenu').style.display = 'none';
    }

    document.getElementById('adminLink').addEventListener('click', function (event) {
        const token = localStorage.getItem('token');
        if (!token) {
            event.preventDefault();
            alert('Anda perlu login terlebih dahulu.');
            window.location.href = '/login';
        } else {
            fetch('http://localhost:5000/adminproduct', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(response => {
                    if (!response.ok) throw new Error('Token tidak valid atau tidak memiliki hak akses');
                    window.location.href = '/adminproduct';
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Akses ditolak: Anda tidak memiliki hak akses atau token tidak valid');
                    window.location.href = '/login';
                });
        }
    });
};

// Menu Navigation
document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.navbar a');
    const sections = document.querySelectorAll('section');

    function scrollToSection(target) {
        if (!target) return;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }

    function updateHash(targetId) {
        history.pushState(null, null, targetId);
    }

    function removeActiveClass() {
        menuItems.forEach(item => item.classList.remove('home-active'));
    }

    function addActiveClass(item) {
        item.classList.add('home-active');
    }

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

// Menu Toggle (dropdown)
function toggleMenu(element) {
    const subMenu = document.getElementById("subMenu");
    const reportSubMenu = document.getElementById('reportSubMenu');
    const productsSubMenu = document.getElementById('productsSubMenu');

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

// Submenu for Reports and Products
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

function loadFavoriteProducts() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log("User is not logged in.");
        return;
    }

    console.log('Fetching favorite products for token:', token);

    fetch('/api/kategoriFavorit/like', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
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
    favorites.forEach(favorite => {
        const productId = favorite.id_produk._id;
        const isFavorited = true;
        const favoriteId = favorite._id;

        localStorage.setItem(`favorite_${productId}`, 'true');
        localStorage.setItem(`favoriteId_${productId}`, favoriteId);

        const heartIcon = document.querySelector(`#heart-icon-${productId}`);
        if (heartIcon) {
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
    container.style.display = 'none';
}

// Display products in the UI with correct favorite status
function displayProducts(data) {
    const products = data.products || [];
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';

    products.forEach(product => {
        const categoryName = product.kategori ? product.kategori.nama_kategori : 'Kategori Tidak Ditemukan';
        const categoryId = product.kategori ? product.kategori._id : '';

        const isFavorited = localStorage.getItem(`favorite_${product._id}`) === 'true';

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

// Toggle favorite status for a product
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

// Update favorite count on the UI
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


// Fetch products on page load
fetchProducts(currentPage);
