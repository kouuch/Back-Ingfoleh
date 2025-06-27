document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    console.log('Token found:', token);

    if (!token) {
        alert("You need to be logged in to access this page.");
        return;
    }

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

    fetch('http://localhost:5000/api/users/admingetuser', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Role dan Produk:', data);

            const tableBody = document.querySelector('#example tbody');
            tableBody.innerHTML = '';

            data.forEach((user, index) => {
                console.log('data:', user);

                const row = document.createElement('tr');
                row.setAttribute('data-id', user._id);
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

    const modalForm = new bootstrap.Modal(document.getElementById('exModal'), {
        backdrop: 'static',
        keyboard: false,
    });

    document.getElementById('addNewBtn').addEventListener('click', function () {
        modalForm.show();
    });

    document.getElementById('close').addEventListener('click', function () {
        window.location.href = '/';
    });

    document.querySelectorAll('input[required]').forEach(input => {
        input.oninvalid = function (e) {
            e.target.setCustomValidity('Harap isi kolom ini');
        };
        input.oninput = function (e) {
            e.target.setCustomValidity('');
        };
    });
});
document.getElementById('close').addEventListener('click', function () {
    window.location.href = '/';
});


// Fungsi untuk menghapus pengguna
function deleteuser(userId) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("You need to be logged in to delete a user.");
        return;
    }

    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`http://localhost:5000/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.msg === 'User berhasil dihapus') {
                    alert('User berhasil dihapus');

                    const row = document.querySelector(`tr[data-id='${userId}']`);
                    if (row) {
                        row.remove();
                    }

                    location.reload();
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

