const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

const signupFormContainer = document.getElementById('signupFormContainer');
const loginFormContainer = document.getElementById('loginFormContainer');

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
    signupFormContainer.style.display = 'block';
    loginFormContainer.style.display = 'none';

    history.pushState(null, '', '/register');
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
    signupFormContainer.style.display = 'none';
    loginFormContainer.style.display = 'block';

    history.pushState(null, '', '/login');
});

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
                localStorage.setItem('role', data.user.role);  
            if (data.user.profilePicture) {
                localStorage.setItem('profilePicture', data.user.profilePicture); 
            }
                loadFavoriteProducts();

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
function loadFavoriteProducts() {
    const token = localStorage.getItem('token');
    console.log('Token:', token); 
    if (!token) {
        console.log("User is not logged in.");
        return;
    }

    console.log('Fetching favorite products for token:', token);

    fetch('/api/kategoriFavorit/like', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(favorites => {
            console.log('Favorites fetched:', favorites);  
            displayFavorites(favorites); 
            updateHeartStatus(favorites);
        })
        .catch(error => {
            console.error('Error loading favorites:', error);
            alert('Gagal mengambil data favorit');
        });
}


// Fungsi untuk menampilkan produk favorit di halaman
function displayProducts(data) {
    const products = data.products || [];  
    console.log('Products:', products);
    if (!Array.isArray(products) || products.length === 0) {
        const container = document.getElementById('productsContainer');
        container.innerHTML = "<p>No products available.</p>";
        return;
    }

    const container = document.getElementById('productsContainer');
    container.innerHTML = '';

    products.forEach(product => {
        const categoryName = product.kategori ? product.kategori.nama_kategori : 'Kategori Tidak Ditemukan';
        const categoryId = product.kategori ? product.kategori._id : '';

        const isFavorited = localStorage.getItem(`favorite_${product._id}`) === 'true';
        console.log('Product:', product, 'Is Favorited:', isFavorited); 

        const favoriteId = localStorage.getItem(`favoriteId_${product._id}`);
        console.log('FavoriteId from localStorage:', favoriteId);  

        const productCard = document.createElement('div');
        productCard.classList.add('box');
        productCard.innerHTML = `
            <img src="${product.foto}" alt="Product Image">
            <span>${categoryName}</span>
            <h2>${product.nama_produk}</h2>
            <h3 class="price">kisaran : Rp ${product.kisaran_harga}</h3>
            <h6><i class='bx bx-buildings'></i>${product.kabupaten_kota}</h6>
            <a href="https://maps.app.goo.gl/TF1mdkSz2HVMcn1y7" target="_blank">
                <i class='bx bx-map'></i>
            </a>
            <i id="heart-icon-${product._id}" class='bx ${isFavorited ? 'bxs-heart' : 'bx-heart'}' onclick="toggleHeart(this, '${product._id}', '${product.nama_produk}', '${categoryId}', '${categoryName}');"></i>
        `;
        container.appendChild(productCard);
    });
}



function displayFavorites(favorites) {
    const container = document.getElementById('favoritesContainer');
    container.innerHTML = '';  

    favorites.forEach(fav => {
        const product = fav.id_produk;  
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