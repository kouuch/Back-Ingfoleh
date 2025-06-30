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

    fetch('http://localhost:5000/api/feedbacks/', {
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

            data.forEach((feedbacks, index) => {
                console.log('data:', feedbacks);

                const row = document.createElement('tr');
                row.setAttribute('data-id', feedbacks._id);
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${feedbacks.email}</td>
                    <td>${feedbacks.rating}</td>
                    <td class="lokasi-penjual">${feedbacks.komentar}</td>
                    <td>${feedbacks.tanggal_review}</td
                    <td class="fotos">
                        <img src="${feedbacks.id_user.profilePicture}" alt="Foto Pengguna" width="100" height="100" style=" object-fit: contain;">
                    </td>
                `;
                tableBody.appendChild(row);
            });

        })

        .catch(error => {
            console.error('Error fetching users:', error);
            alert('Gagal mengambil data Feeddback');
        });
    // Mengonversi tabel ke PDF saat tombol download ditekan
    document.getElementById('downloadPDFBtn').addEventListener('click', () => {
        const element = document.getElementById('example');
        const opt = {
            margin: 5,
            filename: 'tabel_produk.pdf',
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

    document.getElementById('close').addEventListener('click', function () {
        window.location.href = '/';
    });
});



