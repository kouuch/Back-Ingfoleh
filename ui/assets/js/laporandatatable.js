document.addEventListener('DOMContentLoaded', function () {
    // Mengambil token dari localStorage
    const token = localStorage.getItem('token');
    console.log('Token found:', token);

    if (!token) {
        alert("You need to be logged in to access this page.");
        return;  // Jika token tidak ada, hentikan eksekusi lebih lanjut
    }

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

    // Ambil data produk menggunakan token yang valid
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
                <td class="lokasi-penjual">${product.lokasi_penjual}</td>
                <td>${product.kontak_penjual}</td>
                <td>Rp ${product.kisaran_harga}</td>
                <td class="fotos" ><img src="http://localhost:5000${productImagePath}" alt="Product Image" width="50" height="50"></td>
            `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            alert('Gagal mengambil data produk');
        });

    // Inisialisasi modal dengan Bootstrap
    const modalForm = new bootstrap.Modal(document.getElementById('exModal'), {
        backdrop: 'static',
        keyboard: false,
    });

    // Modal Form untuk menambahkan produk baru
    document.getElementById('addNewBtn').addEventListener('click', function () {
        modalForm.show();  // Tampilkan modal
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

// POST request untuk menambahkan produk baru
document.getElementById('addNewProducts').addEventListener('submit', function (event) {
    event.preventDefault();  // Mencegah form melakukan refresh halaman

    const token = localStorage.getItem('token');  // Ambil token dari localStorage
    const kabupatenKota = document.getElementById('productCity').value;
    const produkName = document.getElementById('produkName').value;
    const kategori = document.getElementById('produkCategories').value;
    const lokasiPenjual = document.getElementById('productLocation').value;
    const kontakPenjual = document.getElementById('costumerContact').value;
    const kisaranHarga = document.getElementById('produkKota').value;
    const foto = document.getElementById('productImg').files[0];  // Ambil file gambar produk

    // Buat FormData untuk mengirim data termasuk file gambar
    const formData = new FormData();
    formData.append('kabupaten_kota', kabupatenKota);
    formData.append('nama_produk', produkName);
    formData.append('kategori', kategori);
    formData.append('lokasi_penjual', lokasiPenjual);
    formData.append('kontak_penjual', kontakPenjual);
    formData.append('kisaran_harga', kisaranHarga);
    formData.append('foto', foto);  // Mengirim foto produk

    // Mengirim request POST ke server
    fetch('http://localhost:5000/api/admincreate', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData  // Kirim FormData (termasuk gambar)
    })
        .then(response => response.json())
        .then(data => {
            alert('Produk berhasil ditambahkan');
            window.location.reload();  // Reload halaman setelah produk ditambahkan
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Gagal menambahkan produk');
        });
});

// Fungsi untuk mengedit produk
function editProduct(productId) {
    // Ambil data produk yang akan diedit
    fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log("Data produk yang diterima:", data);  // Log data produk yang diterima

            // Isi form edit produk dengan data yang diterima
            document.getElementById('productCityEdit').value = data.kabupaten_kota;
            document.getElementById('produkNameEdit').value = data.nama_produk;

            // Pastikan kategori yang dipilih di dropdown sesuai dengan data kategori produk
            if (data.kategori && data.kategori._id) {
                document.getElementById('produkCategoriesEdit').value = data.kategori._id;  // Isi dropdown kategori
            } else {
                console.log("Kategori tidak ditemukan atau kosong!");
            }

            document.getElementById('productLocationEdit').value = data.lokasi_penjual;
            document.getElementById('costumerContactEdit').value = data.kontak_penjual;
            document.getElementById('produkKotaEdit').value = data.kisaran_harga;

            // Set foto lama di form jika diperlukan
            if (data.foto) {
                const oldFoto = document.getElementById('oldFoto');
                if (oldFoto) {
                    oldFoto.src = `http://localhost:5000${data.foto}`;
                }
            }

            // Set ID produk yang akan diedit
            document.getElementById('productId').value = productId;

            // Menampilkan form edit dan menyembunyikan form tambah produk
            document.getElementById('addNewProducts').style.display = 'none';
            document.getElementById('editProductForm').style.display = 'block';

            // Menampilkan modal edit produk
            var modalForm = new bootstrap.Modal(document.getElementById('exModal'), {
                backdrop: 'static',
                keyboard: false,
            });
            modalForm.show();
        })
        .catch(error => {
            console.error('Error fetching product data:', error);
            alert('Gagal mengambil data produk');
        });
}

// Form submit untuk mengupdate produk
document.getElementById('editProductForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const formData = new FormData();

    const productId = document.getElementById('productId').value;  // Ambil ID produk dari form

    // Ambil data form edit produk
    formData.append('kabupaten_kota', document.getElementById('productCityEdit').value);
    formData.append('nama_produk', document.getElementById('produkNameEdit').value);
    formData.append('kategori', document.getElementById('produkCategoriesEdit').value);  // Pastikan kategori dipilih dengan benar
    formData.append('lokasi_penjual', document.getElementById('productLocationEdit').value);
    formData.append('kontak_penjual', document.getElementById('costumerContactEdit').value);
    formData.append('kisaran_harga', document.getElementById('produkKotaEdit').value);

    const foto = document.getElementById('productImgEdit').files[0];  // Ambil foto baru jika ada
    if (foto) {
        formData.append('foto', foto);  // Kirim file foto
    }

    // Log data form untuk debugging
    console.log("Data yang dikirimkan ke server:");
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    // Kirim request PUT untuk mengupdate produk
    fetch(`http://localhost:5000/api/adminupdate/${productId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            console.log("Respons dari server:", data);
            alert('Produk berhasil diperbarui!');
            window.location.reload();  // Reload halaman setelah update produk
        })
        .catch(error => {
            console.error('Error updating product:', error);
            alert('Gagal memperbarui produk');
        });
});

// Fungsi untuk menghapus produk
function deleteProduct(productId) {
    const token = localStorage.getItem('token');  // Ambil token dari localStorage
    if (!token) {
        alert("You need to be logged in to delete a product.");
        return;  // Jika token tidak ada, hentikan eksekusi
    }

    // Konfirmasi penghapusan produk
    if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
        // Mengirim request DELETE ke server
        fetch(`http://localhost:5000/api/delete/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,  // Kirim token di header Authorization
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.msg === 'Produk berhasil dihapus') {
                    alert('Produk berhasil dihapus');
                    location.reload();  // Reload halaman untuk melihat perubahan
                } else {
                    alert('Gagal menghapus produk');
                }
            })
            .catch(error => {
                console.error('Error deleting product:', error);
                alert('Terjadi kesalahan saat menghapus produk');
            });
    }
}







// Log data form untuk debugging
// for (let pair of formData.entries()) {
//     console.log(pair[0] + ': ' + pair[1]);
// }