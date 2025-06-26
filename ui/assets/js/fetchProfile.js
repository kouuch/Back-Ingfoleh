document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const profilePicElement = document.getElementById('userProfilePic');

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
            
            // Menyimpan foto profil ke localStorage jika baru
            if (user.profilePicture) {
                localStorage.setItem('profilePicture', user.profilePicture);
            }

            // Pastikan gambar profil diperbarui di halaman
            const savedProfilePic = user.profilePicture || '/images/userDefault/user.png';
            profilePicElement.src = savedProfilePic;
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
