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

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (event) {
        // Menampilkan pop-up login 
        event.preventDefault();
        showLoginPopup();
    });
});


// Menutup pop-up
document.getElementById('closePopup').addEventListener('click', function() {
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
