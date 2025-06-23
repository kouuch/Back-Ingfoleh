document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'admin') {
        document.getElementById('adminLink').style.display = 'none';  // Sembunyikan tombol admin
    } else {
        document.getElementById('nonAdminLink').style.display = 'none';  // Sembunyikan tombol non-admin
    }
});