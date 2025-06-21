const productsPerPage = 8;
// Fungsi untuk mengambil produk berdasarkan kategori dan halaman
function fetchProducts(page = 1, category = '') {
    console.log(`Fetching products for page: ${page}, category: ${category}`);  // Log kategori dan halaman
    const url = category ? `/api/products?category=${category}&page=${page}` : `/api/products?page=${page}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data from API:', data);  // Log data yang diterima dari API

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

// Fungsi untuk menampilkan produk di halaman
function displayProducts(data) {
    console.log("Received data in displayProducts:", data);  // Log seluruh data yang diterima

    const products = data.products || [];  // Pastikan kita mendapatkan array produk

    // Cek apakah 'products' adalah array dan memiliki panjang > 0
    if (!Array.isArray(products) || products.length === 0) {
        console.log("No products found or products is not an array.");
        const container = document.getElementById('productsContainer');
        container.innerHTML = "<p>No products available.</p>"; // Tampilkan pesan bahwa tidak ada produk
        return;
    }

    const container = document.getElementById('productsContainer');
    container.innerHTML = ''; // Kosongkan sebelumnya

    // Menampilkan produk
    products.forEach(product => {
        console.log(`Rendering product: ${product.nama_produk}`);  // Log nama produk yang sedang dirender
        const productCard = document.createElement('div');
        productCard.classList.add('box');
        productCard.innerHTML = `
            <img src="${product.foto}" alt="Product Image">
            <span>${product.kategori}</span>
            <h2>${product.nama_produk}</h2>
            <h3 class="price">kisaran : Rp ${product.kisaran_harga}</h3>
            <h6><i class='bx bx-buildings'></i>${product.kabupaten_kota}</h6>
            <a href="https://maps.app.goo.gl/TF1mdkSz2HVMcn1y7" target="_blank">
                <i class='bx bx-map'></i>
            </a>
            <i class='bx bx-heart' onclick="toggleFavorite(this, '${product._id}');"></i>
        `;
        container.appendChild(productCard);
    });
}


// Fungsi untuk menambahkan atau menghapus favorit
function toggleFavorite(element, productId) {
    const isFavorited = element.classList.contains('bxs-heart');
    console.log(`Toggling favorite for productId: ${productId}, already favorited: ${isFavorited}`);  // Log status favorit
    if (isFavorited) {
        element.classList.remove('bxs-heart');
        element.classList.add('bx-heart');
        fetch(`/api/favorites/${productId}`, { method: 'DELETE' })
            .then(() => console.log(`Removed product ${productId} from favorites`))
            .catch(error => console.log('Error removing from favorites:', error));
    } else {
        element.classList.remove('bx-heart');
        element.classList.add('bxs-heart');
        fetch(`/api/favorites`, {
            method: 'POST',
            body: JSON.stringify({ productId }),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(() => console.log(`Added product ${productId} to favorites`))
            .catch(error => console.log('Error adding to favorites:', error));
    }
}

// Fungsi untuk memperbarui pagination (Prev/Next)
function updatePagination() {
    const prevButton = document.querySelector('.prev-btn');
    const nextButton = document.querySelector('.next-btn');
    const pageNumbers = document.querySelector('.page-numbers');

    // Menonaktifkan tombol prev jika halaman pertama
    prevButton.disabled = currentPage === 1;
    // Menonaktifkan tombol next jika halaman terakhir
    nextButton.disabled = currentPage === totalPages;

    // Update nomor halaman
    pageNumbers.innerHTML = '';  // Kosongkan halaman nomor sebelumnya

    // Menampilkan halaman berdasarkan halaman yang aktif
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    // Menampilkan nomor halaman dengan tombol
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('span');
        pageButton.textContent = i;
        pageButton.classList.add('page-number');
        if (i === currentPage) {
            pageButton.classList.add('page-numberNow');  // Menandai halaman aktif
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            console.log(`Navigating to page: ${currentPage}`);  // Log halaman yang dipilih
            fetchProducts(currentPage);  // Ambil produk untuk halaman yang dipilih
        });
        pageNumbers.appendChild(pageButton);
    }
}

// Fungsi untuk menangani klik tombol prev dan next
document.querySelector('.prev-btn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;  // Decrement halaman
        console.log(`Going to previous page: ${currentPage}`);  // Log halaman yang akan dikunjungi
        fetchProducts(currentPage);  // Ambil produk untuk halaman sebelumnya
    }
});

document.querySelector('.next-btn').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;  // Increment halaman
        console.log(`Going to next page: ${currentPage}`);  // Log halaman yang akan dikunjungi
        fetchProducts(currentPage);  // Ambil produk untuk halaman berikutnya
    }
});

let currentPage = 1; // Halaman saat ini
let totalPages = 2; // Total halaman (sesuaikan dengan data API)
console.log('Current totalPages:', totalPages);

// Fungsi untuk memperbarui elemen page-numbers
function updatePageNumbers() {
    const pageNumbersElement = document.querySelector('.page-numbers');
    pageNumbersElement.innerHTML = `Halaman ${currentPage} dari ${totalPages}`; // Update halaman saat ini dan total halaman
}

// Fungsi untuk menangani klik tombol "Prev"
document.querySelector('.prev-btn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--; // Kurangi nomor halaman
        updatePageNumbers(); // Perbarui tampilan nomor halaman
        fetchProducts(currentPage); // Ambil data produk untuk halaman baru
    }
});

// Fungsi untuk menangani klik tombol "Next"
document.querySelector('.next-btn').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++; // Tambah nomor halaman
        updatePageNumbers(); // Perbarui tampilan nomor halaman
        fetchProducts(currentPage); // Ambil data produk untuk halaman baru
    }
});

// Panggil fungsi ini saat halaman dimuat untuk pertama kali
updatePageNumbers();

// Mengambil dan menampilkan produk default (misalnya produk populer atau terbaru)
fetchProducts(currentPage);  // Menampilkan halaman pertama secara default










//------------
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
    const url = isFavorited ? `/api/kategoriFavorit/${productId}` : '/api/kategoriFavorit'; // URL untuk POST atau DELETE

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
            if (response.ok) {
                if (isFavorited) {
                    element.classList.remove('bxs-heart');
                    element.classList.add('bx-heart');
                    console.log('Produk berhasil dihapus dari favorit');
                } else {
                    element.classList.remove('bx-heart');
                    element.classList.add('bxs-heart');
                    console.log('Produk berhasil ditambahkan ke favorit');
                }
            } else {
                console.error('Gagal mengupdate status favorit');
            }
        })
        .catch(error => console.error('Error toggling favorite:', error));
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
