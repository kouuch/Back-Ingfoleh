document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
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

    // Mengambil data favorit
    fetch('http://localhost:5000/api/kategoriFavorit/like', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Data favorit:', data);

            const tableBody = document.querySelector('#example tbody');
            tableBody.innerHTML = '';

            // Mengisi data favorit ke dalam tabel
            data.forEach((favorit, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${index + 1}</td>
                <td>${favorit.user_id.username}</td>  <!-- Menampilkan Username User -->
                <td>${favorit.nama_produk}</td>  <!-- Nama produk -->
                <td>${favorit.nama_kategori}</td>  <!-- Nama kategori produk -->
                <td>${favorit.jumlah_favorit}</td>  <!-- Jumlah favorit -->
            `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching favorit data:', error);
            alert('Gagal mengambil data favorit');
        });
});

// Close modal atau redirect ke halaman utama
document.getElementById('close').addEventListener('click', function () {
    window.location.href = '/';
});