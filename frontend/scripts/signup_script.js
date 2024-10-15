const inputs = document.querySelectorAll('.otp-input');

    inputs.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        // Automatically move to the next input if a number is entered
        if (e.target.value.length === 1 && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }

        // Automatically move back to the previous input if the current one is cleared
        if (e.inputType === 'deleteContentBackward' && index > 0) {
          inputs[index - 1].focus();
        }
    });
});
const getOtp=async ()=>{
  try {
    event.preventDefault();
    const email=document.getElementById('email').value;
    const response=await fetch('/api/v1/hotels/signup/otp',{
      method:"POST",
      headers:{
          'Content-Type':"application/json"
      },
      body: JSON.stringify({
        to:email
      })
    })
    if(response.status===200)
    {
      const otpcontainer=document.querySelectorAll('.otp-container');
      otpcontainer[0].style.display="grid";
      document.getElementById('info').textContent="Otp sent successfully";
      document.getElementById('email').disabled = true;
      document.getElementById('email').style.opacity = 0.5;
    }
    else{
      document.getElementById('Info').textContent="Unable to send otp";
    }
    const otpbutton=document.getElementById('getotp');
    otpbutton.style.backgroundColor="red";
    otpbutton.disabled=true;
    setTimeout(()=>{
      otpbutton.style.disabled=false;
      otpbutton.style.backgroundColor="rgb(66, 66, 209)";
      document.getElementById('email').disabled = false;
      document.getElementById('email').style.opacity = 1;
    },2*60*1000);
  } catch (error) {
    console.log(error);
    document.getElementById('Info').textContent="Something Went wrong";
  }
}
const onVerify= async()=>{
  event.preventDefault();
  const inputs = document.querySelectorAll('.otp-input');
  let s="";
  inputs.forEach(i=>s=s+i.value)
  try {
    const response= await fetch('/api/v1/hotels/signup/verify',{
      method:"POST",
      headers:{
        'Content-Type':"application/json"
      },
      body: JSON.stringify({
        email: document.getElementById('email').value,
        otp:s
      })
    });
    if(response.status===200)
    {
      const styles={
        "grid-template-columns": "2fr 5fr"
      }
      document.getElementById('getotp').style.display="none";
      document.querySelector('.arrange').style["grid-template-columns"]= "2fr 5fr";
      document.getElementById('info').textContent="OTP verified successfully";
      document.querySelectorAll('.otp-container')[0].style.display="none";
    }
    else{

      document.getElementById('info').textContent='Invalid OTP';
    }
  } catch (error) {
    console.log(error);
    document.getElementById('info').textContent='Something went wrong';
  }
}
const onSignup= async()=>{
  event.preventDefault();
  try {
    const email=document.getElementById('email').value;
    const password=document.getElementById('passwd').value;
    const retype=document.getElementById('repasswd').value;
    const user={
      email,
      password,
      retype
    }
    const response= await fetch('/api/v1/hotels/signup',{
      method:"POST",
      headers:{
        'Content-Type':"application/json"
      },
      body: JSON.stringify(user)
    })
    const info=document.getElementById('info');
    if(response.status===201)
    {
      info.textContent='User created Successfully';
      setInterval(()=>{
        window.location.href='/review.html'
      },2000);
    }
    else{
      const data=await response.json();
      info.textContent=data.message;
    }
  } catch (error) {
    document.getElementById('Info').textContent='An error Occured!';
  }

}
document.getElementById('getotp').addEventListener('click',getOtp);
document.getElementById('verify').addEventListener('click',onVerify);
document.getElementById('signup_button').addEventListener('click',onSignup);