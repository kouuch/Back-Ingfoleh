document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'admin') {
        if (document.getElementById('reportMenu')) {
            document.getElementById('reportMenu').style.display = 'none';
        }
        if (document.getElementById('productsMenu')) {
            document.getElementById('productsMenu').style.display = 'none';
        }
    }

});

function checkAccess(event, menuId, requiredRole = 'admin') {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
        event.preventDefault(); 
        alert('Anda perlu login terlebih dahulu.');
        window.location.href = '/login'; 
    } else if (role !== requiredRole) {
        event.preventDefault(); 
        alert('Anda tidak memiliki akses ke halaman ini.');
        window.location.href = '/unauthorized';
    } else {
    }
}

document.getElementById('productsMenu').addEventListener('click', function (event) {
    checkAccess(event, 'products menu'); 
});

document.getElementById('reportMenu').addEventListener('click', function (event) {
    checkAccess(event, 'report bmenu'); 
});

