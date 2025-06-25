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
    fetch('http://localhost:5000/api/users/admingetuser', {
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

            data.forEach((user, index) => {
                console.log('data:', user);

                const row = document.createElement('tr');
                row.setAttribute('data-id', user._id);  // Menambahkan data-id pada baris
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>${user.no_telepon}</td>
                    <td>${user.status_akun}</td>
                    <td>${new Date(user.tanggal_daftar).toLocaleDateString()}</td>
                    <td><img src="${user.profilePicture}" alt="Foto Pengguna" width="50" height="50"></td>
                    <td>
                        <button onclick="deleteuser('${user._id}')">Hapus</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

        })
        .catch(error => {
            console.error('Error fetching users:', error);
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


// Fungsi untuk menghapus pengguna
function deleteuser(userId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("You need to be logged in to delete a user.");
        return;
    }

    // Konfirmasi sebelum menghapus
    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`http://localhost:5000/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, // Mengirim token di header
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.msg === 'User berhasil dihapus') {
                    alert('User berhasil dihapus');

                    // Menghapus baris yang sesuai dari tabel
                    const row = document.querySelector(`tr[data-id='${userId}']`);
                    if (row) {
                        row.remove();
                    }

                    // Refresh halaman setelah berhasil menghapus
                    location.reload();  // Reload halaman untuk memperbarui tampilan tabel
                } else {
                    alert('Gagal menghapus user');
                }
            })
            .catch(error => {
                console.error('Error deleting user:', error);
                alert('Gagal menghapus user');
            });
    }
}

