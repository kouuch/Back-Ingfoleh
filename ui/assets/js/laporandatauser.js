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
                    <td class="fotos" ><img src="${user.profilePicture}" alt="Foto Pengguna" width="50" height="50"></td>
                `;
                tableBody.appendChild(row);
            });

        })
        .catch(error => {
            console.error('Error fetching users:', error);
            alert('Gagal mengambil data produk');
        });
    // Mengonversi tabel ke PDF saat tombol download ditekan
    document.getElementById('downloadPDFBtn').addEventListener('click', () => {
        const element = document.getElementById('example'); // Tabel HTML yang akan di-convert
        const opt = {
            margin:       5,  // Menyesuaikan margin
            filename:     'laporan_user.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, logging: true, letterRendering: true, useCORS: true }, // Menyesuaikan skala dan memperbaiki rendering
            jsPDF: {
                unit: 'mm', 
                format: 'legal',  // Menggunakan format legal
                orientation: 'landscape', 
                autoPaging: true, // Menambahkan halaman otomatis jika tabel panjang
            }
        };

        // Menggunakan html2pdf untuk konversi
        html2pdf().from(element).set(opt).save();
    });
    // Close modal atau redirect ke halaman utama
    document.getElementById('close').addEventListener('click', function () {
        window.location.href = '/'; // Mengarahkan ke halaman utama
        // history.pushState(null, null, '/'); // Alternatif menggunakan history
    });

})
