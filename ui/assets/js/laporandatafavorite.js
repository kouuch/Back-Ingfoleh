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


    fetch('http://localhost:5000/api/kategoriFavorit/adminfavorit', {
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

            data.forEach((favorit, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${index + 1}</td>
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
    // Mengonversi tabel ke PDF saat tombol download ditekan
    document.getElementById('downloadPDFBtn').addEventListener('click', () => {
        const element = document.getElementById('example'); 
        const opt = {
            margin: 5, 
            filename: 'laporan produk favorit.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, logging: true, letterRendering: true, useCORS: true }, 
            jsPDF: {
                unit: 'mm',
                format: 'legal',  
                orientation: 'landscape',
                autoPaging: true, 
            }
        };

        html2pdf().from(element).set(opt).save();
    });
});

// Close modal atau redirect ke halaman utama
document.getElementById('close').addEventListener('click', function () {
    window.location.href = '/'; 
});