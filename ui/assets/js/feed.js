document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.getElementById('submitFooter');
    const emailInput = document.getElementById('email');
    const ratingInput = document.getElementById('rating');
    const commentInput = document.getElementById('comment');
    const feedbackList = document.getElementById('feedbackList');
    const stars = document.querySelectorAll('#ratingForm i');

    // Ambil feedback yang sudah ada di database saat halaman dimuat
    fetchFeedbacks();

    // Event untuk mengubah bintang menjadi aktif saat diklik
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

    // Submit feedback
    submitButton.addEventListener('click', (e) => {
        e.preventDefault();

        if (!emailInput.value || !ratingInput.value || ratingInput.value == "0" || !commentInput.value) {
            alert('Semua field harus diisi dan rating minimal 1');
            return;
        }

        const feedbackData = {
            email: emailInput.value,
            rating: ratingInput.value,
            komentar: commentInput.value
        };

        // Cek data yang dikirim ke API
        console.log('Data yang dikirim ke API:', feedbackData);

        // Kirim feedback ke API
        fetch('http://localhost:5000/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(feedbackData)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Response dari API:', data); // Log response dari API
                alert('Feedback berhasil dikirim');
                emailInput.value = '';
                ratingInput.value = '0';
                commentInput.value = '';
                stars.forEach(s => {
                    s.classList.remove('bxs-star');
                    s.classList.add('bx-star');
                });

                // Render feedback terbaru
                renderFeedback(data);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Terjadi kesalahan dalam mengirim feedback');
            });
    });

    // Fungsi untuk mengambil feedback dari API
    function fetchFeedbacks() {
        fetch('api/feedbacks')
            .then(response => {
                console.log('Response Status:', response.status); // Log status response
                if (!response.ok) {
                    throw new Error(`Server Error: ${response.statusText}`);
                }
                return response.json(); // Hanya mem-parsing JSON jika response status OK
            })
            .then(data => {
                console.log('Fetched Feedbacks:', data); // Log feedback yang diterima
                data.forEach(feedback => {
                    renderFeedback(feedback);
                });
            })
            .catch(error => {
                console.error('Error fetching feedbacks:', error);
                // alert('Terjadi kesalahan dalam mengambil feedback');
            });
    }

    // Render feedback
    function renderFeedback(feedback) {
        // Cek jika jumlah feedback melebihi 3, hapus yang pertama (feedback lama)
        if (feedbackList.children.length >= 3) {
            feedbackList.removeChild(feedbackList.firstChild);
        }

        const feedbackItem = document.createElement('div');
        feedbackItem.classList.add('box');

        // Generate bintang rating berdasarkan nilai
        const starsHtml = generateStars(feedback.rating);

        // Update bagian innerHTML sesuai dengan format yang Anda inginkan
        feedbackItem.innerHTML = `
            <i class='bx bxs-quote-alt-left'></i>
            <div class="stars">
                ${starsHtml}
            </div>
            <p>${feedback.komentar}</p>
            <div class="review-profile">
                <img src="${feedback.id_user.profilePicture}" alt="User Profile Picture">
                <h3>${feedback.email}</h3>
            </div>
        `;

        // Menambahkan feedback terbaru ke dalam daftar feedback
        feedbackList.appendChild(feedbackItem);
    }

    // Fungsi untuk membuat bintang berdasarkan rating
    function generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += "<i class='bx bxs-star'></i>";  // Bintang penuh
            } else {
                stars += "<i class='bx bx-star'></i>";  // Bintang kosong
            }
        }
        return stars;
    }
});
