const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

const signupFormContainer = document.getElementById('signupFormContainer');
const loginFormContainer = document.getElementById('loginFormContainer');

// Mengatur transisi saat tombol "Masuk" diklik
signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
    signupFormContainer.style.display = 'block';
    loginFormContainer.style.display = 'none';

    // Ganti URL ke /register tanpa reload halaman
    history.pushState(null, '', '/register');
});

// Mengatur transisi saat tombol "Daftar" diklik
signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
    signupFormContainer.style.display = 'none';
    loginFormContainer.style.display = 'block';

    // Ganti URL ke /login tanpa reload halaman
    history.pushState(null, '', '/login');
});

// Mengecek URL saat halaman dimuat untuk menentukan form yang harus ditampilkan
window.addEventListener('load', () => {
    const signupFormContainer = document.getElementById('signupFormContainer');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const container = document.getElementById('container');

    if (window.location.pathname === "/register") {
        container.classList.add("right-panel-active");
        signupFormContainer.style.display = 'block';
        loginFormContainer.style.display = 'none';
    } else {
        container.classList.remove("right-panel-active");
        signupFormContainer.style.display = 'none';
        loginFormContainer.style.display = 'block';
    }
});



// Login
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const emailOrUsername = loginForm.querySelector('input[type="text"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emailOrUsername, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                // Menyimpan token dan user_id di localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user_id', data.userId);

                // Memuat produk favorit setelah login berhasil
                loadUserFavorites(); // Fungsi untuk memuat data favorit pengguna dari backend

                window.location.href = '/';
            } else {
                alert('Login gagal: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Login gagal, coba lagi');
        });
});

// Fungsi untuk memuat favorit setelah login
function loadUserFavorites() {
    const userId = localStorage.getItem('user_id');
    if (userId) {
        fetch(`/api/kategoriFavorit?user_id=${userId}`)
            .then(response => response.json())
            .then(favorites => {
                // Loop melalui favorit dan simpan di localStorage
                favorites.forEach(fav => {
                    localStorage.setItem(`favorite_${fav.id_produk}`, 'true'); // Menyimpan status favorit
                    localStorage.setItem(`favoriteId_${fav.id_produk}`, fav._id); // Menyimpan ID favorit
                });
            })
            .catch(error => console.error('Error loading favorites:', error));
    }
}


// Register
const signUpForm = document.querySelector('.sign-up-container form');
signUpForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.msg === "Registrasi Berhasil") {
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            } else {
                alert('Registrasi gagal: ' + data.msg);
            }
        })
        .catch(error => {
            console.error('Registrasi gagal:', error);
            alert('Registrasi gagal: ' + (error.message || 'Coba lagi nanti'));
        });
});