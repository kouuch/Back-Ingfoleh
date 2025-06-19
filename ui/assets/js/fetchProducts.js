const productsPerPage = 8;
let currentPage = 1; // Halaman saat ini
let totalPages = 2;  // Total halaman (sesuaikan dengan data API)

// Fungsi untuk mengambil produk berdasarkan kategori dan halaman
function fetchProducts(page = 1, category = '') {
    //console.log(`Fetching products for page: ${page}, category: ${category}`);
    const url = category ? `/api/products?category=${category}&page=${page}` : `/api/products?page=${page}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            //console.log('Fetched data from API:', data);

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
    //console.log("Received data in displayProducts:", data);

    const products = data.products || [];  // Pastikan kita mendapatkan array produk
    
    if (!Array.isArray(products) || products.length === 0) {
        //console.log("No products found or products is not an array.");
        const container = document.getElementById('productsContainer');
        container.innerHTML = "<p>No products available.</p>";
        return;
    }

    const container = document.getElementById('productsContainer');
    container.innerHTML = '';

    products.forEach(product => {
        //console.log(`Rendering product: ${product.nama_produk}`);
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

// Fungsi untuk memperbarui pagination (Prev/Next)
function updatePagination() {
    const prevButton = document.querySelector('.prev-btn');
    const nextButton = document.querySelector('.next-btn');
    const pageNumbers = document.querySelector('.page-numbers');

    // Menonaktifkan tombol prev jika halaman pertama
    prevButton.disabled = currentPage === 1;
    // Menonaktifkan tombol next jika halaman terakhir
    nextButton.disabled = currentPage === totalPages;

    // Update nomor halaman yang menampilkan halaman saat ini
    pageNumbers.innerHTML = `Halaman ${currentPage} dari ${totalPages}`;

    //console.log(`Updating pagination: Current Page: ${currentPage}, Total Pages: ${totalPages}`);
}

// Fungsi untuk menangani klik tombol prev dan next
document.querySelector('.prev-btn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;  // Decrement halaman
        //console.log(`Going to previous page: ${currentPage}`);
        fetchProducts(currentPage);  // Ambil produk untuk halaman sebelumnya
    }
});

document.querySelector('.next-btn').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;  // Increment halaman
        //console.log(`Going to next page: ${currentPage}`);
        fetchProducts(currentPage);  // Ambil produk untuk halaman berikutnya
    }
});

// Mengambil dan menampilkan produk default (misalnya produk populer atau terbaru)
fetchProducts(currentPage);  // Menampilkan halaman pertama secara default
