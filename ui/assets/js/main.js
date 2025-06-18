// swiper initialization
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

// Heart toggle function
function toggleHeart(element) {
    if (element.classList.contains('bx-heart')) {
        element.classList.remove('bx-heart');
        element.classList.add('bxs-heart');
    } else {
        element.classList.remove('bxs-heart');
        element.classList.add('bx-heart');
    }
}

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
    const token = localStorage.getItem('token')

    if (token) {
        document.getElementById('guestMenu').style.display = 'none';
        document.getElementById('profileMenu').style.display = 'block';
    } else {
        document.getElementById('guestMenu').style.display = 'block';
        document.getElementById('profileMenu').style.display = 'none';
    }
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

// Function to close overlay when clicking the close button (X)
document.getElementById('closeOverlayBtn').addEventListener('click', function () {
    document.getElementById('overlay').style.display = 'none';

    // Reset URL hash to '/' when closing overlay
    history.pushState(null, null, '/');
});

// Toggle menu for dropdown
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

// Show login popup
function showLoginPopup() {
    document.getElementById('loginPrompt').style.display = 'flex';
}

// Close login popup
document.getElementById('closePopup').addEventListener('click', function () {
    document.getElementById('loginPrompt').style.display = 'none';
});

// Logout function
document.getElementById('logoutBtn').addEventListener('click', function () {
    localStorage.removeItem('token');
    window.location.href = '/';
});
