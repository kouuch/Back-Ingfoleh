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

    modalForm = new bootstrap.Modal(document.getElementById('exModal'), {
        backdrop: 'static',
        keyboard: false,
    });

    document.getElementById('addNewBtn').addEventListener('click', function () {
        modalForm.show();
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

// post Toko
document.getElementById('addNewBtn').addEventListener('submit', function (event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const tokoName = document.getElementById('tokoName').value;
    const kabupatenKota = document.getElementById('tokoCity').value;
    const alamatToko = document.getElementById('tokoLocation').value;
    const kontakToko = document.getElementById('tokoContact').value;

    const formData = new FormData();
    formData.append('nama_toko', tokoName);
    formData.append('kabupaten_kota', kabupatenKota);
    formData.append('alamat_lengkap', alamatToko);
    formData.append('kontak_toko', kontakToko);
    console.log('Form Data:', formData);
    fetch('http://localhost:5000/api/toko/admincreate', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            alert('Toko berhasil ditambahkan');
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Gagal menambahkan toko');
        });

});
// Memuat data toko untuk di edit
function loadTokoData(tokoId) {
    fetch(`http://localhost:5000/api/toko/admintoko/${tokoId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('tokoId').value = data._id;
            document.getElementById('EdittokoName').value = data.nama_toko;
            document.getElementById('EdittokoCity').value = data.kabupaten_kota;
            document.getElementById('EdittokoLocation').value = data.alamat_lengkap;
            document.getElementById('EdittokoContact').value = data.kontak_toko;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Gagal memuat data toko');
        });
}

// Fungsi untuk mengedit toko
function editToko(tokoId) {
    loadTokoData(tokoId);
    modalForm.show();

    const editForm = document.getElementById('EditNewToko');
    if (editForm) {
        editForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const tokoId = document.getElementById('tokoId').value;

            const tokoName = document.getElementById('EdittokoName').value;
            const kabupatenKota = document.getElementById('EdittokoCity').value;
            const alamatToko = document.getElementById('EdittokoLocation').value;
            const kontakToko = document.getElementById('EdittokoContact').value;

            const updatedTokoData = {
                nama_toko: tokoName,
                kabupaten_kota: kabupatenKota,
                alamat_lengkap: alamatToko,
                kontak_toko: kontakToko
            };

            fetch(`http://localhost:5000/api/toko/admintoko/${tokoId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTokoData)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('response:', data);
                    alert('Toko berhasil diperbarui');
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Gagal memperbarui toko');
                });
        });
    }
}

// Fungsi untuk menghapus toko
function deleteToko(tokoId) {
    const token = localStorage.getItem('token');

    fetch(`http://localhost:5000/api/toko/delete/${tokoId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Response:', data);
            alert(data.msg);
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Gagal menghapus toko');
        });
}
