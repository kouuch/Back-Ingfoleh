var swiper = new Swiper(".home", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});


window.addEventListener('load', () => {
    loadFavoriteProducts();  // Memastikan favorit dimuat setiap kali halaman dimuat
});

// Document loaded event
document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.navbar a');
    const sections = document.querySelectorAll('section');

    // Scroll to section function
    function scrollToSection(target) {
        if (!target) return;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    // Hash update function
    function updateHash(targetId) {
        history.pushState(null, null, targetId);
    }

    // Remove and Add active class on menu items
    function removeActiveClass() {
        menuItems.forEach(item => item.classList.remove('home-active'));
    }

    function addActiveClass(item) {
        item.classList.add('home-active');
    }

    // Highlight navbar on scroll
    function highlightNavbarOnScroll() {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 50;
            const sectionHeight = section.offsetHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                currentSectionId = `#${section.id}`;
            }
        });

        if (currentSectionId) {
            removeActiveClass();
            const activeItem = document.querySelector(`.navbar a[href="${currentSectionId}"]`);
            if (activeItem) {
                addActiveClass(activeItem);
                updateHash(currentSectionId);
            }
        }
    }

    // Throttle scroll event
    function throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function () {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function () {
                    if (Date.now() - lastRan >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    // Apply throttle to scroll event
    window.addEventListener('scroll', throttle(highlightNavbarOnScroll, 100));

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                scrollToSection(target);
                updateHash(targetId);
                removeActiveClass();
                addActiveClass(item);
            }
        });
    });
});

// Menu login check
window.onload = function () {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');  // Menyimpan role di localStorage

    // Mengatur tampilan menu berdasarkan status login
    if (token && role) {
        document.getElementById('guestMenu').style.display = 'none';
        document.getElementById('profileMenu').style.display = 'block';
    } else {
        document.getElementById('guestMenu').style.display = 'block';
        document.getElementById('profileMenu').style.display = 'none';
    }

    // Event listener untuk link admin
    document.getElementById('adminLink').addEventListener('click', function (event) {
        // Cek apakah token ada di localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            event.preventDefault();  // Mencegah pengalihan ke /adminproducts
            alert('Anda perlu login terlebih dahulu.');
            window.location.href = '/login';  // Redirect ke halaman login
        } else {
            // Jika token ada, lakukan fetch ke server untuk memverifikasi token
            fetch('http://localhost:5000/adminproduct', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })

                .then(response => {
                    if (!response.ok) {
                        throw new Error('Token tidak valid atau tidak memiliki hak akses');
                    }
                    // Jika response berhasil (status 200), alihkan ke halaman admin
                    window.location.href = '/adminproduct';  // Arahkan ke halaman admin
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Akses ditolak: Anda tidak memiliki hak akses atau token tidak valid');
                    window.location.href = '/login';  // Redirect ke halaman login jika ada error
                });
        }
    });
}



// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

// Handle the 'Lihat Semua' button click
document.getElementById('showProductsBtn').addEventListener('click', function () {
    if (isLoggedIn()) {
        // User is logged in, show the overlay
        document.getElementById('overlay').style.display = 'block';

        // Update URL hash to '/allproducts' when 'Lihat Semua' is clicked
        history.pushState(null, null, '/allproducts');
    } else {

        showLoginPopup();
    }
});



// Show login popup
function showLoginPopup() {
    document.getElementById('loginPrompt').style.display = 'flex';
}

// Close login popup
document.getElementById('closePopup').addEventListener('click', function () {
    document.getElementById('loginPrompt').style.display = 'none';
});




// button navigation
document.getElementById('showProductsBtn').addEventListener('click', () => {
    document.getElementById('overlay').style.display = 'block';
    // Dapatkan produk pertama atau favorit
    fetch('/api/products')
        .then(response => response.json())
        .then(products => displayProducts(products));
});

window.addEventListener('load', () => {
    const role = localStorage.getItem('role');
    const adminLink = document.getElementById('adminLink');

    if (role === 'admin') {
        adminLink.style.display = 'block';  // Menampilkan link admin sebagai inline-block
    } else {
        adminLink.style.display = 'none';   // Menyembunyikan link admin
    }
});



// Function to close overlay when clicking the close button (X)
document.getElementById('closeOverlayBtn').addEventListener('click', function () {
    // Menyembunyikan overlay
    document.getElementById('overlay').style.display = 'none';

    // Menghapus data favorit di localStorage
    localStorage.removeItem('favorite_');
    localStorage.removeItem('favoriteId_');

    // Reset URL hash ke '/'
    history.pushState(null, null, '/');
});
