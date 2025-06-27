document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); // Ambil role dari localStorage
    console.log('role:', role);
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
                    console.log('Fetched user data:', user); // Log data pengguna
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
            no_telepon: { selector: '#no_telepon', type: 'text', defaultValue: 'N/A' },
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
    const fields = ['username', 'email', 'no_telepon', 'status', 'joinDate', 'userProfilePic'];

    if (token) {
        fetch('http://localhost:5000/api/users/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(user => {
                console.log('User data fetched:', user);

                document.getElementById('username').value = user.username; 
                document.getElementById('email').value = user.email;
                document.getElementById('no_telepon').value = user.no_telepon || 'N/A';
                document.getElementById('status').value = user.status_akun || 'Unknown';
                document.getElementById('joinDate').value = new Date(user.tanggal_daftar).toLocaleDateString();
                document.getElementById('userProfilePic').src = user.profilePicture || '/images/userDefault/user.png';
                // Menampilkan username di h4
                document.getElementById('usernameText').textContent = user.username; 
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
                    console.log(`Editing field: ${field}`); 
                    fieldElement.removeAttribute('readonly');
                });
            } else {
                fieldElement.setAttribute('readonly', true); 
            }
        });

        saveBtn.addEventListener('click', () => {
            const updatedData = {
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                no_telepon: document.getElementById('no_telepon').value,
            };

            console.log('Sending updated data:', updatedData);

            if (!updatedData.username || !updatedData.email || !updatedData.no_telepon) {
                alert('Please fill in all the required fields.');
                return;
            }

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
                    console.log('Updated user data:', updatedUser);

                    // Update h4 dengan username yang baru
                    document.getElementById('usernameText').textContent = updatedUser.username; 

                    // perbarui UI dan set kembali readonly pada input
                    fields.forEach(field => {
                        const fieldElement = document.getElementById(field);
                        fieldElement.setAttribute('readonly', true);  
                    });

                    alert('Changes saved successfully!');
                })
                .catch(error => {
                    console.error('Error saving changes:', error);
                    alert('Failed to save changes.');
                });
        });



        editProfileBtn.addEventListener('click', () => {
            console.log('Ganti foto profil clicked'); 
            profilePicForm.style.display = 'block';
        });

        profilePicForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!profilePicInput.files.length) {
                alert('Please select an image to upload');
                return;
            }

            const formData = new FormData();
            formData.append('profilePicture', profilePicInput.files[0]);

            console.log('Uploading new profile picture');  

            fetch('http://localhost:5000/api/users/me', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })
                .then(response => response.json())
                .then(updatedUser => {
                    console.log('Updated user profile picture:', updatedUser);  
                    localStorage.setItem('profilePicture', updatedUser.profilePicture)
                    document.getElementById('userProfilePic').src = updatedUser.profilePicture; 

                    alert('Profile picture updated!');
                    profilePicForm.style.display = 'none';  
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


document.getElementById('close').addEventListener('click', function () {
    window.location.href = '/';
});