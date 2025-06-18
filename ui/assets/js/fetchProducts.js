document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');  // Ambil token dari localStorage

    if (token) {
        // Mengambil data profil pengguna
        fetch('http://localhost:5000/api/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`  // Kirimkan token di header Authorization
            }
        })
        .then(response => response.json())
        .then(user => {
            // Menampilkan data pengguna di halaman
            const profileContainer = document.getElementById('profileContainer');
            const userName = document.getElementById('userName');
            const userEmail = document.getElementById('userEmail');
            const userProfilePic = document.getElementById('userProfilePic');
            
            // Update elemen dengan data pengguna
            userName.textContent = user.username;
            userEmail.textContent = user.email;
            userProfilePic.src = user.profilePicture;  // Gantilah dengan URL gambar profil pengguna

            // Menampilkan profil di halaman
            profileContainer.style.display = 'block';  // Menampilkan kontainer profil
        })
        .catch(err => {
            console.error('Error fetching profile:', err);
            alert('Error fetching profile. Please try again later.');
        });
    } else {
        alert('Please log in first');
    }
});
