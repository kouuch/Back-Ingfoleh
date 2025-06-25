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
    const modalForm = new bootstrap.Modal(document.getElementById('exModal'), {
        backdrop: 'static',
        keyboard: false,
    });

    // Modal Form untuk menambahkan toko baru
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

// post Toko
document.getElementById('addNewToko').addEventListener('submit', function (event) {
    event.preventDefault();  // Mencegah form melakukan refresh halaman

    const token = localStorage.getItem('token');  // Ambil token dari localStorage
    const tokoName = document.getElementById('tokoName').value;
    const kabupatenKota = document.getElementById('tokoCity').value;
    const alamatToko = document.getElementById('tokoLocation').value;
    const kontakToko = document.getElementById('tokoContact').value;

    // Buat data toko dalam bentuk objek JSON
    const tokoData = {
        nama_toko: tokoName,
        kabupaten_kota: kabupatenKota,
        alamat_lengkap: alamatToko,
        kontak_toko: kontakToko
    };

    // Mengirim request POST ke server dengan data JSON
    fetch('http://localhost:5000/api/toko/admincreate', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,  // Kirim token di header Authorization
            'Content-Type': 'application/json', // Tentukan bahwa data yang dikirim adalah JSON
        },
        body: JSON.stringify(tokoData)  // Kirim data JSON
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
