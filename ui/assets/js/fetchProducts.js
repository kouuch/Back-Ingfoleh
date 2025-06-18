// Fungsi untuk mengambil produk berdasarkan kategori
function filterProducts(category) {
    console.log(`Filtering products by category: ${category}`);  // Log kategori yang dipilih
    fetch(`/api/products?category=${category}`)
        .then(response => response.json())
        .then(products => {
            console.log('Fetched products:', products);  // Log produk yang diterima
            displayProducts(products);
        })
        .catch(error => console.log('Error fetching products:', error));
}

// Fungsi untuk menampilkan produk di halaman
function displayProducts(products) {
    console.log('Displaying products:', products);  // Log produk yang akan ditampilkan
    const container = document.getElementById('productsContainer');
    container.innerHTML = ''; // Kosongkan sebelumnya
    products.forEach(product => {
        console.log(`Rendering product: ${product.nama_produk}`);  // Log nama produk yang sedang dirender
        const productCard = document.createElement('div');
        productCard.classList.add('box');
        productCard.innerHTML = `
            <img src="${product.foto}" alt="">
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

// Mengambil dan menampilkan produk default (misalnya produk populer atau terbaru)
fetch('/api/products')  // Pastikan URL ini benar
    .then(response => response.json())
    .then(products => {
        console.log('Fetched default products:', products);  // Log produk default
        displayProducts(products);
    })
    .catch(error => console.log('Error fetching products:', error));

// Menampilkan detail produk setelah diklik
document.querySelectorAll('.box').forEach(box => {
    box.addEventListener('click', () => {
        const productId = box.getAttribute('data-id');  // Ambil ID produk
        console.log(`Redirecting to product detail for productId: ${productId}`);  // Log ketika produk diklik
        window.location.href = `/product-detail/${productId}`;  // Arahkan ke halaman detail produk
    });
});
