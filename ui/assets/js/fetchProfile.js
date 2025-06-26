document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); // Ambil role dari localStorage
    console.log('role:', role);  // Debugging role

    if (token) {
        console.log('Token found:', token);
        console.log('role:', role); // Debugging role

        // Fungsi untuk mengambil data profil pengguna
        function fetchProfileData(apiUrl, profileElements) {
            fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`  
                }
            })
                .then(response => response.json())  
                .then(user => {
                    console.log('User data fetched:', user);  // Debugging user data
                    const usernameElement = document.getElementById('username');
                    if (user.username) {
                        usernameElement.textContent = user.username;
                    } else {
                        console.error('username tidak ditemukan pada data user');
                    }

                    // Lakukan hal yang sama untuk elemen lainnya jika perlu
                    Object.keys(profileElements).forEach(key => {
                        const element = document.getElementById(profileElements[key].id);
                        if (element) {
                            if (profileElements[key].type === 'text') {
                                element.textContent = user[key] || profileElements[key].defaultValue;
                            } else if (profileElements[key].type === 'image') {
                                element.src = user[key] || profileElements[key].defaultValue;
                            }
                        }
                    });
                })
                .catch(err => {
                    console.error('Error fetching profile:', err);
                    alert('Error fetching profile. Please try again later.');
                });
        }

        const apiUrl = 'http://localhost:5000/api/users/me';  

        const profileElements = {
            username: { id: 'username', type: 'text', defaultValue: 'No Name' },
            email: { id: 'email', type: 'text', defaultValue: 'N/A' },
            no_telepon: { id: 'no_telepon', type: 'text', defaultValue: 'N/A' },
            userStatus: { id: 'userStatus', type: 'text', defaultValue: 'Unknown' },
            userJoinDate: { id: 'userJoinDate', type: 'text', defaultValue: 'Unknown' },
            userProfilePic: { id: 'userProfilePic', type: 'image', defaultValue: '/images/userDefault/user.png' },
            userSubMenuProfilePic: { id: 'userSubMenuProfilePic', type: 'image', defaultValue: '/images/userDefault/user.png' },
            role: { id: 'role', type: 'text', defaultValue: 'No Role' }  // Menambahkan role ke profil
        };

        fetchProfileData(apiUrl, profileElements);
    } else {
        alert('Please log in first');
    }
});




window.addEventListener('load', () => {
    loadFavoriteProducts();  // Memastikan favorit dimuat setiap kali halaman dimuat
});
