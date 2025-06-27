document.addEventListener('DOMContentLoaded', () => {
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

    fetch('http://localhost:5000/api/adminget', {
        method: 'GET',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
        .then(res => res.json())
        .then(data => {
            const tbody = document.querySelector('#example tbody');
            tbody.innerHTML = '';
            data.forEach((p, i) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${i + 1}</td>
                    <td>${p.nama_produk}</td>
                    <td>${p.kabupaten_kota}</td>
                    <td>${p.kategori ? p.kategori.nama_kategori : 'N/A'}</td>
                    <td class="lokasi-penjual">${p.lokasi_penjual}</td>
                    <td>${p.kontak_penjual}</td>
                    <td>Rp ${p.kisaran_harga}</td>
                    <td class="fotos">
                        <img src="http://localhost:5000${p.foto}" width="50" height="50" alt="Product">
                    </td>`;
                tbody.appendChild(row);
            });
        })
        .catch(err => {
            console.error('Error fetching products:', err);
            alert('Gagal mengambil data produk');
        });

    // Mengonversi tabel ke PDF saat tombol download ditekan
    document.getElementById('downloadPDFBtn').addEventListener('click', () => {
        const element = document.getElementById('example'); 
        const opt = {
            margin:       5,  
            filename:     'tabel_produk.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, logging: true, letterRendering: true, useCORS: true }, 
            jsPDF: {
                unit: 'mm', 
                format: 'legal',  
                orientation: 'landscape', 
                autoPaging: true, 
            }
        };

        html2pdf().from(element).set(opt).save();
    });

    document.getElementById('close').addEventListener('click', () => {
        window.location.href = '/';
    });
});
