document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const profilePicElement = document.getElementById('userProfilePic');
    const usernameElement = document.getElementById('username');
    const noTeleponElement = document.getElementById('no_telepon');
    const userSubMenuProfilePic = document.getElementById('userSubMenuProfilePic');

    if (token) {
        // Ambil data profil dari API
        fetch('http://localhost:5000/api/users/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(user => {
                console.log('User data fetched:', user);  // Debugging user data

                // Menentukan foto profil yang akan digunakan
                const savedProfilePic = user.profilePicture || '/images/userDefault/user.png';

                // Memperbarui elemen profil dengan foto yang sama
                profilePicElement.src = savedProfilePic;
                userSubMenuProfilePic.src = savedProfilePic;  // Menggunakan foto profil yang sama untuk subprofil

                // Menyimpan foto profil ke localStorage jika baru
                if (user.profilePicture) {
                    localStorage.setItem('profilePicture', user.profilePicture);
                }

                // Memperbarui username dan no_telepon
                usernameElement.textContent = user.username || 'No Name';
                noTeleponElement.textContent = user.no_telepon || 'N/A';
            })
            .catch(err => {
                console.error('Error fetching profile data:', err);
                alert('Error fetching profile data. Please try again later.');
            });
    } else {
        alert('Please log in first');
    }
});



window.addEventListener('load', () => {
    const savedProfilePic = localStorage.getItem('profilePicture');
    const profilePicElement = document.getElementById('userProfilePic');

    // Cek jika profilePicture ada di localStorage
    if (savedProfilePic) {
        // Tambahkan query string unik untuk memastikan gambar baru dimuat tanpa cache
        const uniqueProfilePicUrl = savedProfilePic + '?v=' + new Date().getTime();

        // Memastikan gambar profil yang baru di-load
        profilePicElement.src = uniqueProfilePicUrl;
    } else {
        // Gambar default jika tidak ada di localStorage
        profilePicElement.src = '/images/userDefault/user.png';
    }
});




window.addEventListener('load', () => {
    loadFavoriteProducts();  // Memastikan favorit dimuat setiap kali halaman dimuat
});
