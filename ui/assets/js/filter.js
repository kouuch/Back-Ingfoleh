function filterProducts(category) {
    fetch(`http://localhost:5000/api/productskate?category=${category}`)
        .then(response => response.json())
        .then(data => {
            const productList = document.getElementById('products-container');
            productList.innerHTML = '';

            updateCategoryItemCount(category, data.totalProducts);

            if (data.products.length === 0) {
                productList.innerHTML = "<p>No products found for this category.</p>";
            }

            data.products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('box', 'filter-aksesoris'); 

                productDiv.innerHTML = `
                    <img src="${product.foto}" alt="${product.nama_produk}">
                    <span>${product.kategori.nama_kategori}</span>
                    <h2>${product.nama_produk}</h2>
                    <h3 class="price">Kisaran: Rp ${product.kisaran_harga}+ <span>/Pks</span></h3>
                    <h6><i class='bx bx-buildings'></i>${product.kabupaten_kota}</h6>
                    <a href="https://maps.app.goo.gl/TF1mdkSz2HVMcn1y7" target="_blank" title="Lihat lokasi Toko di Google Maps">
                        <i class='bx bx-map'></i>
                    </a>
                    <i class='bx bx-heart' onclick="toggleHeart(this);"></i>
                `;

                productList.appendChild(productDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
}

// Fungsi untuk memperbarui jumlah produk dalam kategori
function updateCategoryItemCount(category, totalProducts) {
    let categoryElement;

    switch (category) {
        case 'Aksesoris':
            categoryElement = document.getElementById('category-aksesoris-count');
            break;
        case 'Makanan':
            categoryElement = document.getElementById('category-makanan-count');
            break;
        case 'Minuman':
            categoryElement = document.getElementById('category-minuman-count');
            break;
        case 'Fashion':
            categoryElement = document.getElementById('category-fashion-count');
            break;
        default:
            return;
    }

    if (categoryElement) {
        categoryElement.textContent = `${totalProducts} items`;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    filterProducts(''); 
});
