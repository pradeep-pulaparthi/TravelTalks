let onSubmit=async ()=>{
    try {
        await event.preventDefault();
        let userName=document.getElementById('name').value;
        let password=document.getElementById('passwd').value;
        let user={
            email:userName,
            password:password
        }
        const response=await fetch('/api/v1/hotels',{
            method:"POST",
            headers:{
                'Content-Type':"application/json"
            },
            body: JSON.stringify(user)
        })
        console.log(response);
        // let data=await response.json();
        console.log("fetch request done..");
        console.log(response.status)
        if (response.status === 200) {
            const data = await response.json(); // Parse the JSON response
            console.log(data.message); // Log the success message
            document.querySelector('#message').textContent="";
            document.getElementById('name').value="";
            document.getElementById('passwd').value="";
            // Redirect the user to the review page
            window.location.href = '/review.html'; // Perform the redirect
        } else {
            const messageShower = document.querySelector('#message');
            messageShower.textContent = "Login Failed: Invalid Credentials";
        }
    } catch (error) {
        console.log("catch block executed")
        const messageShower=document.querySelector('#message');
        messageShower.innerHTML="Server stopped responding";
        console.log(error.message);
    }
}
document.getElementById('submit').addEventListener("click",onSubmit);