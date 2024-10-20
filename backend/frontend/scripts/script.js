document.getElementById('submit').addEventListener('click', onSubmit);

async function onSubmit(event) {
    event.preventDefault(); // Prevent form submission

    const userName = document.getElementById('name').value.trim();
    const password = document.getElementById('passwd').value.trim();

    // Basic validation
    if (!userName || !password) {
        showToast('Please enter valid credentials', 'error');
        return;
    }

    let user = {
        email: userName,
        password: password
    };
    console.log(user);
    try {
        const response = await fetch('/api/v1/hotels', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        });
        document.getElementById('name').value = '';
        document.getElementById('passwd').value = '';
        // Handle response status
        if (response.redirected) {
            window.location.href = response.url; // This will trigger the redirect
        } else {
            const data = await response.json();
            showToast(data.message, 'error');
        }
    } catch (error) {
        console.log("Error occurred:", error.message);
        showToast('Server is not responding. Please try again later.', 'error');
    }
}

// Toast Notification Function
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.classList.add(type); // Success or error styling
    toast.textContent = message;

    document.body.appendChild(toast);

    // Animate and remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 500); // Allow animation to complete before removal
    }, 3000);
}
