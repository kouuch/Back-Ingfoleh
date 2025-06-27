let modalForm;

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

    // get toko
    fetch('http://localhost:5000/api/toko/admintoko', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,  
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Role dan Toko:', data);  

            const tableBody = document.querySelector('#example tbody');
            tableBody.innerHTML = '';  

            data.forEach((toko, index) => {
                console.log('Toko:', toko);

                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${index + 1}</td>
                <td>${toko.nama_toko}</td>
                <td>${toko.kabupaten_kota}</td>
                <td>${toko.alamat_lengkap}</td>
                <td>${toko.kontak_toko}</td>
            `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching tokos:', error);
            alert('Gagal mengambil data Toko');
        });
    document.getElementById('downloadPDFBtn').addEventListener('click', () => {
        const element = document.getElementById('example'); 
        const opt = {
            margin: 5,  
            filename: 'Laporan Toko.pdf',
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
document.getElementById('close').addEventListener('click', function () {
    window.location.href = '/'; 
});