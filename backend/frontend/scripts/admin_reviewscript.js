document.addEventListener('DOMContentLoaded', () => {
    fetchHotels();
    document.getElementById('sort-reviews').addEventListener('change', sortReviews);
    const addHotelBtn = document.getElementById('add-hotel-btn');
    const hotelsList = document.getElementById('hotel-list');
    // Show review form when button is clicked
    const showReviewFormBtn = document.getElementById('show-review-form-btn');
    const reviewFormSection = document.getElementById('review-form-section');
    addHotelBtn.addEventListener('click',addHotelEvenetListener);
    showReviewFormBtn.addEventListener('click', () => {
        reviewFormSection.classList.toggle('hidden'); // Toggle visibility
        showReviewFormBtn.style.display = 'none'; // Hide the button once form is shown
    });
});

async function addHotelEvenetListener(){
    const addHotelBtn = document.getElementById('add-hotel-btn');
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter hotel name';
    input.classList.add('hotel-input');
    addHotelBtn.replaceWith(input);
    input.focus();
    input.addEventListener('keypress', async (event) => {
        if (event.key === 'Enter') {
            const hotelName = input.value.trim();
            if (hotelName) {
                await addHotel(hotelName)
                input.value = ''; // Clear the input field
                input.replaceWith(addHotelBtn); // Replace input back to button
            }
        }
    });
    input.addEventListener('blur',()=>{
        input.value='';
        input.replaceWith(addHotelBtn);
    })
}
async function addHotel(name) {
    try {
        const response= await fetch(`/api/hotels/`,{
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name:name})
        })
        if(response.status===200){
            showToast("Added successfully");
            fetchHotels();
        }
        else{
            showToast("Unable to add")
        }
    } catch (error) {
        showToast("Something went wrong");
    }
}
async function onDelete(hotelId){
    const confirmation = confirm('Are you sure you want to delete this hotel?');
    if (confirmation) {
        try {
            const response = await fetch(`/api/hotels/${hotelId}`, {
                method: 'DELETE',
            });

            if (response.status===200) {
                fetchHotels();
                showToast("Deleted Successfully");
                
                 // Refresh the hotel list after deletion
            } else {
                showToast("Something went wrong",true)
            }
        } catch (error) {
            console.error('Error deleting hotel:', error);

        }
    }
    else{
        showToast("Confirmation Not Given");
    }
}
async function onUpdate(hotelId) {
    const listItem = document.querySelector(`li[data-id="${hotelId}"]`);
    const currentHotelName = listItem.textContent;

    // Create an input field for editing the hotel name
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentHotelName;
    input.classList.add('hotel-input');
    
    // Replace the current hotel name with the input field
    listItem.replaceWith(input);
    input.focus();

    // When the user presses "Enter," update the hotel name
    input.addEventListener('keypress', async (event) => {
        if (event.key === 'Enter') {
            const newHotelName = input.value.trim();
            if (newHotelName && newHotelName !== currentHotelName) {
                try {
                    // Update the hotel name in the backend
                    const response = await fetch(`/api/hotels/${hotelId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ name: newHotelName })
                    });

                    if (response.status===200) {
                        // On successful update, replace input with the new name
                        showToast('Hotel updated successfully!');
                        fetchHotels();
                        fetchAndDisplayReviews();
                    } else {
                        showToast('Failed to update hotel.');
                    }
                } catch (error) {
                    console.error('Error updating hotel:', error);
                    showToast('Something went wrong.');
                }
            } else {
                // If no change or invalid input, revert back
                input.replaceWith(listItem);
            }
        }
    });

    // If the user clicks outside the input without pressing Enter, revert back
    input.addEventListener('blur', () => {
        input.replaceWith(listItem);
    });
}

function addEditDelButtons(listItem,hotel){
    const editButton=document.createElement('button');
    editButton.classList.add('edit-hotel-btn');
    const deleteButton=document.createElement('button')
    deleteButton.classList.add('delete-hotel-btn')

    // creating icons
    const editIcon=document.createElement('i');
    const deleteIcon=document.createElement('i');
    editIcon.classList.add('fas');
    editIcon.classList.add('fa-edit');
    deleteIcon.classList.add('fas');
    deleteIcon.classList.add('fa-trash');
    
    editButton.appendChild(editIcon);
    deleteButton.appendChild(deleteIcon);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
    deleteButton.addEventListener('click',()=>onDelete(hotel._id));
    editButton.addEventListener('click',()=>onUpdate(hotel._id))
}
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
            addEditDelButtons(listItem,hotel);
 
            // Add the hotel-item class for styling
            listItem.classList.add('hotel-item');
            //delete hotel when delete icon clicked
            // Load hotel reviews on click
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
            document.getElementById('user').value='';
            document.getElementById('rating').value='';
            document.getElementById('comment').value='';
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
function showToast(message,error=false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    if(error){
        toast.style.backgroundColor="red";
    }
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
