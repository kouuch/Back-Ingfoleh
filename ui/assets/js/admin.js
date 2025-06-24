document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'admin') {
        document.getElementById('adminLink').style.display = 'none';  // Sembunyikan tombol admin
    } else {
        document.getElementById('nonAdminLink').style.display = 'none';  // Sembunyikan tombol non-admin
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');  // Cek apakah token ada di localStorage

    if (token) {
        console.log('Token ditemukan:', token);  // Debugging: Pastikan token ada
    } else {
        console.log('Token tidak ditemukan. Pengguna harus login');
        // Jika token tidak ada, arahkan ke halaman login atau tampilkan pesan kesalahan
        window.location.href = '/login'; // Redirect jika token tidak ditemukan
    }
});



document.getElementById('adminLink').addEventListener('click', function(event) {
    const token = localStorage.getItem('token');
    if (!token) {
        event.preventDefault();  // Mencegah pengalihan jika token tidak ada
        alert('Token tidak ditemukan. Anda perlu login terlebih dahulu.');
        window.location.href = '/login';  // Redirect ke halaman login
    }
});

const token = localStorage.getItem('token');
if (!token) {
    console.log('Token tidak ditemukan');
    return;
}

fetch('http://localhost:5000/adminproduct', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`  // Kirim token di header
    }
})
.then(response => response.json())
.then(data => {
    console.log(data); // Menampilkan data yang diterima
})
.catch(error => {
    console.error('Error:', error);
});
