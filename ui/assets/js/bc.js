// swiper
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
// heart
function toggleHeart(element) {
    if (element.classList.contains('bx-heart')) {
        element.classList.remove('bx-heart');
        element.classList.add('bxs-heart');
    } else {
        element.classList.remove('bxs-heart');
        element.classList.add('bx-heart');
    }
}
//===
document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.navbar a');
    const sections = document.querySelectorAll('section');

    function scrollToSection(target) {
        if (!target) return;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth' // Scroll halus
        });
    }

    function updateHash(targetId) {
        history.pushState(null, null, targetId); // Perbarui hash URL tanpa reload
    }

    function removeActiveClass() {
        menuItems.forEach(item => item.classList.remove('home-active'));
    }

    function addActiveClass(item) {
        item.classList.add('home-active');
    }

    function highlightNavbarOnScroll() {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 50; // Offset untuk navbar
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

    // Throttle function to limit the frequency of function calls
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

    // Apply throttling to the scroll event
    window.addEventListener('scroll', throttle(highlightNavbarOnScroll, 100));

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                scrollToSection(target); // Scroll langsung ke elemen target
                updateHash(targetId); // Perbarui hash URL
                removeActiveClass(); // Hapus kelas aktif dari semua item
                addActiveClass(item); // Tambahkan kelas aktif ke item yang diklik
            }
        });
    });
});
//===


// submenu
let subMenu = document.getElementById("subMenu");
const reportMenu = document.getElementById('reportMenu');
const productsMenu = document.getElementById('productsMenu');

const reportSubMenu = document.getElementById('reportSubMenu');
const productsSubMenu = document.getElementById('productsSubMenu');

function toggleMenu(element) {
    if (element.classList.contains('bx-caret-down')) {
        element.classList.remove('bx-caret-down');
        element.classList.add('bx-caret-up');
    } else {
        element.classList.remove('bx-caret-up');
        element.classList.add('bx-caret-down');
    }

    subMenu.classList.toggle("open-menu");

    if (!subMenu.classList.contains("open-menu")) {
        reportSubMenu.classList.remove('open-menu-sub');
        productsSubMenu.classList.remove('open-menu-sub');
    }
}

reportMenu.addEventListener('click', e => {
    e.preventDefault();

    productsSubMenu.classList.remove('open-menu-sub');

    reportSubMenu.classList.toggle('open-menu-sub');
});

productsMenu.addEventListener('click', e => {
    e.preventDefault();

    reportSubMenu.classList.remove('open-menu-sub');

    productsSubMenu.classList.toggle('open-menu-sub');
});


// check
function toggleCheck(element) {
    if (element.classList.contains('bx-checkbox')) {
        element.classList.remove('bx-checkbox');
        element.classList.add('bx-checkbox-checked');
    } else {
        element.classList.remove('bx-checkbox-checked');
        element.classList.add('bx-checkbox');
    }
}

// menu berdasarkan status login
window.onload = function () {
    // check
    const token = localStorage.getItem('token')

    // jika sudah login
    if (token) {
        document.getElementById('guestMenu').style.display = 'none'
        document.getElementById('profileMenu').style.display = 'block'
    } else {
        // jika belum login
        document.getElementById('guestMenu').style.display = 'block'
        document.getElementById('profileMenu').style.display = 'none'
    }
}

// Fungsi untuk memeriksa apakah pengguna sudah login
function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

// Menambahkan event listener untuk tombol yang memunculkan pop-up
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (event) {
        // Menjaga agar tidak melakukan aksi default (misalnya membuka link)
        event.preventDefault();

        // Ambil tujuan dari atribut data-target
        const target = event.target.getAttribute('data-target');

        // Cek jika pengguna sudah login
        if (isLoggedIn()) {
            // Jika sudah login, arahkan pengguna ke tujuan yang diinginkan
            window.location.href = target;  // Arahkan sesuai dengan data-target
        } else {
            // Jika belum login, tampilkan pop-up login
            showLoginPopup();
        }
    });
});

// Menutup pop-up login
document.getElementById('closePopup').addEventListener('click', function () {
    document.getElementById('loginPrompt').style.display = 'none';
});

// Menampilkan pop-up login
function showLoginPopup() {
    document.getElementById('loginPrompt').style.display = 'flex';
}


// fungsi logout
document.getElementById('logoutBtn').addEventListener('click', function () {
    localStorage.removeItem('token')
    window.location.href = '/'
})

// Fungsi untuk menampilkan overlay
document.addEventListener('DOMContentLoaded', () => {
    const showProductsBtn = document.getElementById('showProductsBtn');
    const overlay = document.getElementById('overlay');
    const closeOverlayBtn = document.createElement('button');
    
    // Membuat tombol "close" dan menambahkannya ke overlay
    closeOverlayBtn.classList.add('close-btn');
    closeOverlayBtn.textContent = 'X';
    overlay.querySelector('.products-container').appendChild(closeOverlayBtn);

    // Mengecek apakah pengguna sudah login
    const token = localStorage.getItem('token');
    if (!token) {
        console.log("Pengguna belum login, overlay tidak akan ditampilkan.");
        // Jika pengguna belum login, arahkan ke halaman login atau tampilkan pesan
        return; // Jangan lanjutkan jika pengguna belum login
    }

    // Menampilkan overlay ketika tombol "Lihat Semua" diklik
    showProductsBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Mencegah aksi default
        console.log("Tombol 'Lihat Semua' diklik.");
        
        // Menampilkan overlay
        overlay.style.display = 'flex';
        
        // Perbarui URL hanya jika hash saat ini bukan #overlay
        if (window.location.hash !== '#overlay') {
            console.log("Menampilkan overlay, hash URL diperbarui menjadi '#overlay'.");
            history.replaceState(null, null, '#overlay'); // Ganti hash menggunakan replaceState
        } else {
            console.log("Hash URL sudah '#overlay', tidak ada perubahan.");
        }
    });

    // Menutup overlay ketika tombol "X" diklik
    closeOverlayBtn.addEventListener('click', () => {
        console.log("Tombol 'X' diklik, menutup overlay.");
        overlay.style.display = 'none'; // Menyembunyikan overlay
        
        // Menggunakan replaceState untuk menghapus hash URL dan mencegah masalah dengan Back button
        history.replaceState(null, null, window.location.pathname); // Reset hash tanpa menambahkannya ke riwayat
        console.log("Overlay ditutup, hash URL direset.");
    });

    // Menutup overlay jika area di luar produk diklik
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            console.log("Klik di luar produk, menutup overlay.");
            overlay.style.display = 'none'; // Menyembunyikan overlay
            
            // Reset hash URL menggunakan replaceState
            history.replaceState(null, null, window.location.pathname);
            console.log("Klik di luar overlay, hash URL direset.");
        }
    });

    // Memastikan URL hash tidak menjadi null atau kosong
    window.addEventListener('hashchange', () => {
        console.log("Hash berubah, memeriksa jika hash menjadi null.");
        if (window.location.hash === '#null') {
            console.log("Hash menjadi '#null', reset ke '#overlay'.");
            history.replaceState(null, null, '#overlay'); // Ganti dengan hash yang benar
        }
    });

    // Cek untuk memastikan elemen overlay dan tombol yang diperlukan ada
    console.log("Elemen overlay ditemukan:", overlay);
    console.log("Tombol 'Lihat Semua' ditemukan:", showProductsBtn);
});
