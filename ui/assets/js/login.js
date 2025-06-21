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
            localStorage.setItem('token', data.token);
            localStorage.setItem('user_id', data.userId);
            loadFavoriteProducts();  // Memanggil fungsi untuk menampilkan produk favorit
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



// Fungsi untuk memuat produk favorit setelah login
// Fungsi untuk memuat produk favorit setelah login
// Fungsi untuk memuat produk favorit setelah login
function loadFavoriteProducts() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log("User is not logged in.");
        return;
    }

    fetch('/api/kategoriFavorit/like', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(favorites => {
        console.log('Favorites:', favorites);
        displayFavorites(favorites);  // Menampilkan data favorit
    })
    .catch(error => {
        console.error('Error loading favorites:', error);
        alert('Gagal mengambil data favorit');
    });
}

// Fungsi untuk menampilkan produk favorit di halaman
function displayFavorites(favorites) {
    const container = document.getElementById('favoritesContainer');
    container.innerHTML = '';

    favorites.forEach(favorite => {
        const favoriteCard = document.createElement('div');
        favoriteCard.classList.add('favorite-card');
        favoriteCard.innerHTML = `
            <h3>${favorite.nama_produk}</h3>
            <p>${favorite.nama_kategori}</p>
            <p>Jumlah Favorit: ${favorite.jumlah_favorit}</p>
        `;
        container.appendChild(favoriteCard);
    });
}


function displayFavorites(favorites) {
    const container = document.getElementById('favoritesContainer');
    container.innerHTML = '';  // Bersihkan kontainer

    favorites.forEach(fav => {
        const product = fav.id_produk;  // Ambil data produk favorit
        const favoriteCard = document.createElement('div');
        favoriteCard.classList.add('favorite-card');
        favoriteCard.innerHTML = `
            <img src="${product.foto}" alt="${product.nama_produk}">
            <h2>${product.nama_produk}</h2>
            <p>${product.kategori.nama_kategori}</p>
            <p>Price: Rp ${product.kisaran_harga}</p>
        `;
        container.appendChild(favoriteCard);
    });
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