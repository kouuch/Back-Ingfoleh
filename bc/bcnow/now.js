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
            <i class='bx bx-heart' onclick="toggleHeart(this, '${product._id}', '${product.nama_produk}', '${categoryId}', '${categoryName}');"></i>
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
function toggleHeart(element, productId, productName, productCategoryId, productCategoryName) {
    const token = localStorage.getItem('token'); // Ambil token yang valid dari localStorage
    if (!token) {
        alert("You need to log in to add products to your favorites.");
        return;
    }

    const isFavorited = element.classList.contains('bxs-heart');  // Cek apakah produk sudah di-favoritkan atau belum
    const url = isFavorited ? `/api/kategoriFavorit/${localStorage.getItem(`favoriteId_${productId}`)}` : '/api/kategoriFavorit'; // URL untuk POST atau DELETE

    // Data yang dikirimkan saat POST request
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
        .then(response => {
            // Mengecek apakah response dalam format JSON
            if (response.ok && response.headers.get('Content-Type').includes('application/json')) {
                return response.json(); // Jika response adalah JSON
            } else {
                return response.text().then(text => { throw new Error(text); }); // Jika bukan JSON, ambil teks dan throw error
            }
        })
        .then(data => {
            if (isFavorited) {
                element.classList.remove('bxs-heart');
                element.classList.add('bx-heart');
                console.log('Produk berhasil dihapus dari favorit');
                localStorage.setItem(`favorite_${productId}`, 'false');  // Menandakan produk tidak difavoritkan
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
