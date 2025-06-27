document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const profilePicElement = document.getElementById('userProfilePic');
    const usernameElement = document.getElementById('username');
    const noTeleponElement = document.getElementById('no_telepon');
    const userSubMenuProfilePic = document.getElementById('userSubMenuProfilePic');

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

                const savedProfilePic = user.profilePicture || '/images/userDefault/user.png';

                profilePicElement.src = savedProfilePic;
                userSubMenuProfilePic.src = savedProfilePic;

                if (user.profilePicture) {
                    localStorage.setItem('profilePicture', user.profilePicture);
                }

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

    if (savedProfilePic) {
        const uniqueProfilePicUrl = savedProfilePic + '?v=' + new Date().getTime();

        profilePicElement.src = uniqueProfilePicUrl;
    } else {
        profilePicElement.src = '/images/userDefault/user.png';
    }
});




window.addEventListener('load', () => {
    loadFavoriteProducts();
});
