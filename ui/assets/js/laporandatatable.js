// /js/laporandatatable.js
document.addEventListener('DOMContentLoaded', () => {
    // konstruktor jsPDF untuk build UMD
    const { jsPDF } = window.jspdf;

    // Mengambil token dari localStorage
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You need to be logged in to access this page.');
        return;
    }

    // Inisialisasi DataTables
    $('#example').DataTable({
        destroy       : true,
        language      : {
            lengthMenu  : 'Tampilkan _MENU_ entri per halaman',
            zeroRecords : 'Tidak ada data yang cocok',
            info        : 'Menampilkan _START_ sampai _END_ dari _TOTAL_ entri',
            infoEmpty   : 'Menampilkan 0 sampai 0 dari 0 entri',
            infoFiltered: '(difilter dari total _MAX_ entri)'
        },
        scrollY      : '600px',
        scrollCollapse: true
    });

    // Ambil data produk
    fetch('http://localhost:5000/api/adminget', {
        method : 'GET',
        headers: { Authorization: `Bearer ${token}` }
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

    // Download PDF
    document.getElementById('downloadPDFBtn').addEventListener('click', () => {
        const doc   = new jsPDF();
        const table = document.getElementById('example');
        const rows  = table.querySelectorAll('tbody tr');

        rows.forEach((row, rIdx) => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, cIdx) => {
                doc.text(cell.textContent.trim(), 20 + cIdx * 40, 20 + rIdx * 10);
            });
        });

        doc.save('tabel_produk.pdf');
    });

    // Close modal / redirect
    document.getElementById('close').addEventListener('click', () => {
        window.location.href = '/';
    });

    // Validasi kolom wajib
    document.querySelectorAll('input[required]').forEach(input => {
        input.oninvalid = e => e.target.setCustomValidity('Harap isi kolom ini');
        input.oninput   = e => e.target.setCustomValidity('');
    });
});
