document.addEventListener('DOMContentLoaded', function () {
    // Inisialisasi DataTables
    $('#example').DataTable({
        destroy: true,
        language: {
            lengthMenu: 'Tampilkan _MENU_ entri per halaman',
            zeroRecords: 'Tidak ada data yang cocok',
            info: 'Menampilkan _START_ sampai _END_ dari _TOTAL_ entri',
            infoEmpty: 'Menampilkan 0 sampai 0 dari 0 entri',
            infoFiltered: '(difilter dari total _MAX_ entri)'
        },
        scrollY: '600px',
        scrollCollapse: true
    });

    // Modal Form untuk menambahkan produk baru
    var modalForm;
    document.getElementById('addNewBtn').addEventListener('click', function () {
        modalForm = new bootstrap.Modal(document.getElementById('exModal'), {
            backdrop: 'static',
            keyboard: false,
        });
        modalForm.show();
    });

    // Close modal atau redirect ke halaman utama
    document.getElementById('close').addEventListener('click', function () {
        window.location.href = '/'; // Mengarahkan ke halaman utama
        // history.pushState(null, null, '/'); // Alternatif menggunakan history
    });

    // Menangani validasi input yang wajib diisi
    document.querySelectorAll('input[required]').forEach(input => {
        input.oninvalid = function (e) {
            e.target.setCustomValidity('Harap isi kolom ini');
        };
        input.oninput = function (e) {
            e.target.setCustomValidity('');
        };
    });

});

fetch('http://localhost:5000/api/adminget', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,  // Kirim token di header Authorization
    }
})
.then(response => response.json())
.then(data => {
    console.log('Role dan Produk:', data);  // Log data untuk debugging
    
    const tableBody = document.querySelector('#example tbody');
    tableBody.innerHTML = '';  // Kosongkan tabel sebelum diisi

    data.forEach((product, index) => {
        console.log('Product:', product);
        console.log('Category Name:', product.kategori ? product.kategori.nama_kategori : 'N/A');
        console.log('Product Image:', product.foto);

        // Menyimpan path gambar di productImagePath
        const productImagePath = product.foto;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${product.nama_produk}</td>
            <td>${product.kabupaten_kota}</td>
            <td>${product.kategori ? product.kategori.nama_kategori : 'N/A'}</td>
            <td>${product.lokasi_penjual}</td>
            <td>${product.kontak_penjual}</td>
            <td>Rp ${product.kisaran_harga}</td>
            <td><img src="http://localhost:5000${productImagePath}" alt="Product Image" width="50"></td>
            <td>
                <button onclick="editProduct('${product._id}')">Edit</button>
                <button onclick="deleteProduct('${product._id}')">Hapus</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
})
.catch(error => {
    console.error('Error fetching products:', error);
    alert('Gagal mengambil data produk');
});




// Defining edit and delete product functions
function editProduct(productId) {
    console.log('Edit product with ID:', productId);
    // Add logic for editing the product (e.g., open a modal or redirect to edit page)
}

function deleteProduct(productId) {
    console.log('Delete product with ID:', productId);
    // Add logic for deleting the product (e.g., confirm and then delete via API)
}

// document.getElementById('addNewProducts').addEventListener('submit', function (event) {
//     event.preventDefault();  // Mencegah form melakukan refresh halaman

//     const token = localStorage.getItem('token');  // Ambil token dari localStorage
//     const kabupatenKota = document.getElementById('productCity').value;
//     const produkName = document.getElementById('produkName').value;
//     const kategori = document.getElementById('produkCategories').value;
//     const lokasiPenjual = document.getElementById('productLocation').value;
//     const kontakPenjual = document.getElementById('costumerContact').value;
//     const kisaranHarga = document.getElementById('produkKota').value;
//     const foto = document.getElementById('productImg').files[0];  // Ambil file gambar produk

//     // Buat FormData untuk mengirim data termasuk file gambar
//     const formData = new FormData();
//     formData.append('kabupaten_kota', kabupatenKota);
//     formData.append('nama_produk', produkName);
//     formData.append('kategori', kategori);
//     formData.append('lokasi_penjual', lokasiPenjual);
//     formData.append('kontak_penjual', kontakPenjual);
//     formData.append('kisaran_harga', kisaranHarga);
//     formData.append('foto', foto);  // Mengirim foto produk

//     // Mengirim request POST ke server
//     fetch('http://localhost:5000/api/admincreate', {
//         method: 'POST',
//         headers: {
//             'Authorization': `Bearer ${token}`,
//         },
//         body: formData  // Kirim FormData (termasuk gambar)
//     })
//     .then(response => response.json())
//     .then(data => {
//         alert('Produk berhasil ditambahkan');
//         window.location.reload();  // Reload halaman setelah produk ditambahkan
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         alert('Gagal menambahkan produk');
//     });
// });



