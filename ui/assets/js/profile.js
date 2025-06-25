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

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const saveBtn = document.getElementById('saveBtn');
    const profilePicInput = document.getElementById('profilePicInput');
    const profilePicForm = document.getElementById('profilePicForm');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const fields = ['username', 'email', 'phone', 'status', 'joinDate'];

    if (token) {
        // Ambil data pengguna dari API
        fetch('http://localhost:5000/api/users/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(user => {
                document.getElementById('username').textContent = user.username;
                document.getElementById('email').value = user.email;
                document.getElementById('phone').value = user.phone || 'N/A';
                document.getElementById('status').value = user.status_akun || 'Unknown';
                document.getElementById('joinDate').value = new Date(user.tanggal_daftar).toLocaleDateString();
                document.getElementById('userProfilePic').src = user.profilePicture || '/images/userDefault/user.png';
            })
            .catch(error => {
                console.error('Error fetching user profile:', error);
                alert('Error fetching profile. Please try again later.');
            });

        // Membuat input menjadi editable saat tombol edit diklik
        fields.forEach(field => {
            const fieldElement = document.getElementById(field);
            if (field !== 'status' && field !== 'joinDate') {
                fieldElement.addEventListener('click', () => {
                    fieldElement.removeAttribute('readonly');  // Hapus readonly untuk membuatnya bisa diedit
                });
            } else {
                fieldElement.setAttribute('readonly', true);  // Tidak bisa diedit untuk 'status' dan 'joinDate'
            }
        });


        // Tombol Save Changes untuk memperbarui data pengguna
        // Tombol Save Changes untuk memperbarui data pengguna
        saveBtn.addEventListener('click', () => {
            const updatedData = {
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                // Jangan kirim status_akun dan tanggal_daftar
            };

            // Kirim data perubahan ke server
            fetch('http://localhost:5000/api/users/me', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            })
                .then(response => response.json())
                .then(updatedUser => {
                    // Setelah berhasil, perbarui UI dan set kembali readonly pada input
                    fields.forEach(field => {
                        const fieldElement = document.getElementById(field);
                        fieldElement.setAttribute('readonly', true);  // Kembali menjadi read-only setelah edit
                    });

                    alert('Changes saved successfully!');
                })
                .catch(error => {
                    console.error('Error saving changes:', error);
                    alert('Failed to save changes.');
                });
        });


        // Membuat input foto profil dapat diganti dengan tombol "Ganti Foto"
        editProfileBtn.addEventListener('click', () => {
            // Menampilkan form upload foto jika tombol Edit diklik
            profilePicForm.style.display = 'block';
        });

        // Fungsi untuk mengubah foto profil
        profilePicForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!profilePicInput.files.length) {
                alert('Please select an image to upload');
                return;
            }

            const formData = new FormData();
            formData.append('profilePicture', profilePicInput.files[0]);

            fetch('http://localhost:5000/api/users/me', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })
                .then(response => response.json())
                .then(updatedUser => {
                    alert('Profile picture updated!');
                    document.getElementById('userProfilePic').src = updatedUser.profilePicture;
                    profilePicForm.style.display = 'none';  // Sembunyikan form setelah foto diubah
                })
                .catch(error => {
                    console.error('Error updating profile picture:', error);
                    alert('Failed to update profile picture.');
                });
        });

    } else {
        alert('Please log in first');
    }
});



