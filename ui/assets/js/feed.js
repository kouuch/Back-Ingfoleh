document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.getElementById('submitFooter');
    const emailInput = document.getElementById('email');
    const ratingInput = document.getElementById('rating');
    const commentInput = document.getElementById('comment');
    const feedbackList = document.getElementById('feedbackList');
    const stars = document.querySelectorAll('#ratingForm i');

    fetchFeedbacks();

    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = parseInt(star.getAttribute('data-value'));
            ratingInput.value = value;
            stars.forEach(s => {
                const starValue = parseInt(s.getAttribute('data-value'));
                if (starValue <= value) {
                    s.classList.remove('bx-star');
                    s.classList.add('bxs-star');
                } else {
                    s.classList.remove('bxs-star');
                    s.classList.add('bx-star');
                }
            });
        });
    });

    submitButton.addEventListener('click', (e) => {
        e.preventDefault();
    
        if (!emailInput.value || !ratingInput.value || ratingInput.value == "0" || !commentInput.value) {
            alert('Semua field harus diisi dan rating minimal 1');
            return;
        }
    
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Anda belum login. Silakan login terlebih dahulu untuk mengirim feedback.');
            window.location.href = '/login'; 
            return;
        }
    
        const feedbackData = {
            email: emailInput.value,
            rating: ratingInput.value,
            komentar: commentInput.value
        };
    
        console.log('Data yang dikirim ke API:', feedbackData);
    
        fetch('http://localhost:5000/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(feedbackData)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Response dari API:', data);
                alert('Feedback berhasil dikirim');
                emailInput.value = '';
                ratingInput.value = '0';
                commentInput.value = '';
                stars.forEach(s => {
                    s.classList.remove('bxs-star');
                    s.classList.add('bx-star');
                });
    
                renderFeedback(data);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Terjadi kesalahan dalam mengirim feedback');
            });
    });
    


    function fetchFeedbacks() {
        fetch('api/feedbacks')
            .then(response => {
                console.log('Response Status:', response.status); 
                if (!response.ok) {
                    throw new Error(`Server Error: ${response.statusText}`);
                }
                return response.json(); 
            })
            .then(data => {
                console.log('Fetched Feedbacks:', data); 
                data.forEach(feedback => {
                    renderFeedback(feedback);
                });
            })
            .catch(error => {
                console.error('Error fetching feedbacks:', error);
                
            });
    }

    // Render feedback
    function renderFeedback(feedback) {
        if (feedbackList.children.length >= 3) {
            feedbackList.removeChild(feedbackList.firstChild);
        }

        const feedbackItem = document.createElement('div');
        feedbackItem.classList.add('box');

        const starsHtml = generateStars(feedback.rating);

        feedbackItem.innerHTML = `
            <i class='bx bxs-quote-alt-left'></i>
            <div class="stars">
                ${starsHtml}
            </div>
            <p>${feedback.komentar}</p>
            <div class="review-profile">
                <img src="${feedback.id_user.profilePicture}" alt="User Profile Picture">
                <h3>${feedback.id_user.username}</h3>
            </div>
        `;

        feedbackList.appendChild(feedbackItem);
    }

    // Fungsi untuk membuat bintang berdasarkan rating
    function generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += "<i class='bx bxs-star'></i>"; 
            } else {
                stars += "<i class='bx bx-star'></i>";  
            }
        }
        return stars;
    }
});
