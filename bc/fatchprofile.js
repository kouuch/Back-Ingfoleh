document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');  // Ambil token dari localStorage

    if (token) {
        // Fungsi untuk mengambil data profil dan menampilkan ke elemen-elemen tertentu
        function fetchProfileData(apiUrl, profileElements) {
            fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`  // Kirimkan token di header Authorization
                }
            })
                .then(response => response.json())  // Pastikan respons dalam format JSON
                .then(user => {
                    // Loop untuk meng-update elemen-elemen yang ada pada halaman
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

        // Tentukan elemen yang ingin diperbarui
        const profileElements = {
            userName: { id: 'userName', type: 'text', defaultValue: 'No Name' },
            userEmail: { id: 'userEmail', type: 'text', defaultValue: 'N/A' },
            userPhone: { id: 'userPhone', type: 'text', defaultValue: 'N/A' },
            userStatus: { id: 'userStatus', type: 'text', defaultValue: 'Unknown' },
            userJoinDate: { id: 'userJoinDate', type: 'text', defaultValue: 'Unknown' },
            userProfilePic: { id: 'userProfilePic', type: 'image', defaultValue: '/images/userDefault/user.png' }
        };

        // Tentukan URL API untuk mengambil data profil (Anda bisa menyesuaikan ini)
        const apiUrl = 'http://localhost:5000/api/users/me';  // URL endpoint profil pengguna

        // Ambil dan tampilkan data profil
        fetchProfileData(apiUrl, profileElements);
    } else {
        alert('Please log in first');
    }
});
