document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); // Ambil role dari localStorage

    if (token) {
        // Fungsi untuk mengambil data profil pengguna
        function fetchProfileData(apiUrl, profileElements) {
            fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`  
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch profile data');
                }
                return response.json();  
            })
            .then(user => {
                // Menangani elemen profil berdasarkan key yang diberikan
                Object.keys(profileElements).forEach(key => {
                    const element = document.querySelector(profileElements[key].selector);
                    if (element) {
                        if (profileElements[key].type === 'text') {
                            // Mengupdate teks
                            element.textContent = user[key] || profileElements[key].defaultValue;
                        } else if (profileElements[key].type === 'image') {
                            // Mengupdate gambar profil
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

        // URL API untuk mengambil data profil pengguna
        const apiUrl = 'http://localhost:5000/api/users/me';  

        // Elemen-elemen profil yang akan diupdate
        const profileElements = {
            username: { selector: '#username', type: 'text', defaultValue: 'No Name' },
            email: { selector: '#email', type: 'text', defaultValue: 'N/A' },
            userPhone: { selector: '#userPhone', type: 'text', defaultValue: 'N/A' },
            userStatus: { selector: '#userStatus', type: 'text', defaultValue: 'Unknown' },
            userJoinDate: { selector: '#userJoinDate', type: 'text', defaultValue: 'Unknown' },
            userProfilePic: { selector: '#userProfilePic', type: 'image', defaultValue: '/images/userDefault/user.png' },
            userSubMenuProfilePic: { selector: '#userSubMenuProfilePic', type: 'image', defaultValue: '/images/userDefault/user.png' },
            role: { selector: '#role', type: 'text', defaultValue: 'No Role' }  // Menambahkan role ke profil
        };

        // Memanggil fungsi untuk mengambil dan mengupdate profil
        fetchProfileData(apiUrl, profileElements);
    } else {
        alert('Please log in first');
    }
});

