document.addEventListener('DOMContentLoaded', () => {
    fetchHotels();
    document.getElementById('sort-reviews').addEventListener('change', sortReviews);

    // Show review form when button is clicked
    const showReviewFormBtn = document.getElementById('show-review-form-btn');
    const reviewFormSection = document.getElementById('review-form-section');

    showReviewFormBtn.addEventListener('click', () => {
        reviewFormSection.classList.toggle('hidden'); // Toggle visibility
        showReviewFormBtn.style.display = 'none'; // Hide the button once form is shown
    });
});

async function fetchHotels() {
    try {
        const response = await fetch('/api/hotels/getAll');
        const hotels = await response.json();

        const hotelList = document.getElementById('hotel-list');
        hotelList.innerHTML = ''; // Clear the list

        hotels.forEach((hotel, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = hotel.name;
            listItem.setAttribute('data-id', hotel._id);
            listItem.style.setProperty('--i', index); // Custom property for delay
            listItem.onclick = () => loadHotelReviews(hotel._id);
            hotelList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching hotels:', error);
    }
}

let currentHotelId = null;
async function loadHotelReviews(hotelId) {
    currentHotelId = hotelId;
    await fetchAndDisplayReviews('name'); // Default sorting by name
}

async function sortReviews() {
    const sortBy = document.getElementById('sort-reviews').value;
    if (currentHotelId) {
        await fetchAndDisplayReviews(sortBy);
    }
}

async function fetchAndDisplayReviews(sortBy) {
    try {
        const response = await fetch(`/api/hotels/${currentHotelId}/reviews?sort=${sortBy}`);
        const reviews = await response.json();
        const reviewsContainer = document.getElementById('reviews-container');
        const hotelNameElement = document.getElementById('hotel-name');

        hotelNameElement.textContent = reviews.hotelName; // Assume API returns the hotel name
        reviewsContainer.innerHTML = ''; // Clear previous reviews

        if (reviews.reviews.length === 0) {
            reviewsContainer.innerHTML = `<p class="no-reviews">No reviews yet. Be the first to leave a review!</p>`;
        } else {
            reviews.reviews.forEach(review => {
                const reviewElement = document.createElement('div');
                reviewElement.classList.add('review');
                reviewElement.innerHTML = `
                    <h4>${review.user} - Rating: ${review.rating}</h4>
                    <p>${review.comment}</p>
                `;
                reviewsContainer.appendChild(reviewElement);
            });
        }

        // Show the "Leave a Review" button if there are reviews or no reviews
        document.getElementById('show-review-form-btn').style.display = 'inline-block';

        // Hide the review form section
        document.getElementById('review-form-section').classList.add('hidden');
    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}

document.getElementById('review-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const hotelId = currentHotelId;
    const user = document.getElementById('user').value;
    const rating = document.getElementById('rating').value;
    const comment = document.getElementById('comment').value;

    if (!user || !rating || !comment) {
        showToast('Please fill in all fields.');
        return;
    }

    try {
        const response = await fetch(`/api/hotels/${hotelId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user, rating, comment }),
        });

        if (response.ok) {
            showToast('Review submitted successfully!');
            loadHotelReviews(hotelId); // Reload the reviews to reflect the new one
        } else {
            showToast('Failed to submit review.');
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        showToast('Something went wrong.');
    }
});

// Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
