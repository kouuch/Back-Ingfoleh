let modalForm;

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

    // get toko
    fetch('http://localhost:5000/api/toko/admintoko', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,  // Kirim token di header Authorization
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Role dan Toko:', data);  // Log data untuk debugging

            const tableBody = document.querySelector('#example tbody');
            tableBody.innerHTML = '';  // Kosongkan tabel sebelum diisi

            data.forEach((toko, index) => {
                console.log('Toko:', toko);

                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${index + 1}</td>
                <td>${toko.nama_toko}</td>
                <td>${toko.kabupaten_kota}</td>
                <td>${toko.alamat_lengkap}</td>
                <td>${toko.kontak_toko}</td>
                <td>
                    <button onclick="editToko('${toko._id}')">Edit</button>
                    <button onclick="deleteToko('${toko._id}')">Hapus</button>
                </td>
            `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching tokos:', error);
            alert('Gagal mengambil data Toko');
        });

    // Inisialisasi modal dengan Bootstrap
    modalForm = new bootstrap.Modal(document.getElementById('exModal'), {
        backdrop: 'static',
        keyboard: false,
    });

    // Modal Form untuk menambahkan toko baru
    document.getElementById('addNewBtn').addEventListener('click', function () {
        modalForm.show();  // Tampilkan modal
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

// post Toko
document.getElementById('addNewBtn').addEventListener('submit', function (event) {
    event.preventDefault();  // Mencegah form melakukan refresh halaman

    const token = localStorage.getItem('token');  // Ambil token dari localStorage
    const tokoName = document.getElementById('tokoName').value;
    const kabupatenKota = document.getElementById('tokoCity').value;
    const alamatToko = document.getElementById('tokoLocation').value;
    const kontakToko = document.getElementById('tokoContact').value;

    // Buat FormData untuk mengirim data termasuk file gambar
    // Buat FormData untuk mengirim data termasuk file gambar
    const formData = new FormData();
    formData.append('nama_toko', tokoName);
    formData.append('kabupaten_kota', kabupatenKota);
    formData.append('alamat_lengkap', alamatToko);
    formData.append('kontak_toko', kontakToko);
    console.log('Form Data:', formData);
    // Mengirim request POST ke server
    fetch('http://localhost:5000/api/toko/admincreate', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,  // Hanya header Authorization
        },
        body: formData  // Kirim FormData (termasuk gambar)
    })
        .then(response => response.json())
        .then(data => {
            alert('Toko berhasil ditambahkan');
            window.location.reload();  // Reload halaman setelah toko ditambahkan
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Gagal menambahkan toko');
        });

});
// Memuat data toko untuk di edit
function loadTokoData(tokoId) {
    fetch(`http://localhost:5000/api/toko/admintoko/${tokoId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('tokoId').value = data._id;
        document.getElementById('EdittokoName').value = data.nama_toko;
        document.getElementById('EdittokoCity').value = data.kabupaten_kota;
        document.getElementById('EdittokoLocation').value = data.alamat_lengkap;
        document.getElementById('EdittokoContact').value = data.kontak_toko;
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Gagal memuat data toko');
    });
}

// Fungsi untuk mengedit toko
function editToko(tokoId) {
    loadTokoData(tokoId);  // Memuat data toko ke dalam form
    modalForm.show();  // Menampilkan modal

    // Pastikan form sudah dimuat dan modal terbuka, baru tambahkan event listener
    const editForm = document.getElementById('EditNewToko');
    if (editForm) {
        editForm.addEventListener('submit', function (event) {
            event.preventDefault();  // Mencegah form melakukan refresh halaman

            // Ambil ID toko yang tersembunyi
            const tokoId = document.getElementById('tokoId').value;

            // Ambil data dari form
            const tokoName = document.getElementById('EdittokoName').value;
            const kabupatenKota = document.getElementById('EdittokoCity').value;
            const alamatToko = document.getElementById('EdittokoLocation').value;
            const kontakToko = document.getElementById('EdittokoContact').value;

            // Buat objek data toko yang akan diupdate
            const updatedTokoData = {
                nama_toko: tokoName,
                kabupaten_kota: kabupatenKota,
                alamat_lengkap: alamatToko,
                kontak_toko: kontakToko
            };

            // Mengirim request PUT ke server
            fetch(`http://localhost:5000/api/toko/admintoko/${tokoId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Token untuk autentikasi
                    'Content-Type': 'application/json',  // Mengirim data dalam format JSON
                },
                body: JSON.stringify(updatedTokoData)  // Mengirimkan data toko yang sudah diubah
            })
            .then(response => response.json())
            .then(data => {
                console.log('response:', data);  // Log response untuk debugging    
                alert('Toko berhasil diperbarui');
                window.location.reload();  // Reload halaman setelah toko diperbarui
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Gagal memperbarui toko');
            });
        });
    }
}
