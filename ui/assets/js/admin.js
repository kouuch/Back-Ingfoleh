document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'admin') {
        document.getElementById('adminLink').style.display = 'none';
    }
    //  else {
    //     document.getElementById('nonAdminLink').style.display = 'none';  
    // }
});

document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');

    if (token) {
        console.log('Token ditemukan:', token);
    } else {
        console.log('Token tidak ditemukan. Pengguna harus login');
        window.location.href = '/login';
    }
});



document.getElementById('adminLink').addEventListener('click', function (event) {
    const token = localStorage.getItem('token');
    if (!token) {
        event.preventDefault();
        alert('Token tidak ditemukan. Anda perlu login terlebih dahulu.');
        window.location.href = '/login';
    }
});

