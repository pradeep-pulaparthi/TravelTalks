// Constants for elements
const emailInput = document.getElementById("email");
const sendOtpButton = document.getElementById("send-otp");
const otpContainer = document.getElementById("otp-container");
const otpInput = document.getElementById("otp");
const verifyOtpButton = document.getElementById("verify-otp");
const passwordInput = document.getElementById("passwd");
const rePasswordInput = document.getElementById("repasswd");
const submitButton = document.getElementById("submit");
const messageDisplay = document.getElementById("message");

// Function to show toast notifications
function showToast(message, type) {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add("hide");
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// Handle OTP sending
sendOtpButton.addEventListener("click", async () => {
  const email = emailInput.value;
  if (!email) {
      showToast("Please enter your email.", "error");
      return;
  }

  try {
      const response = await fetch("/api/v1/hotels/signup/otp", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ to: email }),
      });

      const data = await response.json();
      if (data.success) {
          showToast("OTP sent successfully. Please check your email.", "success");
          otpContainer.style.display = "flex";  // Show OTP input and button
          sendOtpButton.disabled = true;
          emailInput.disabled=true;
          // Disable the button for 2 minutes and change the button color
          setTimeout(() => {
              sendOtpButton.disabled = false;
              emailInput.disabled=false;
          }, 120000);
      } else {
          showToast(data.message, "error");
      }
  } catch (error) {
      showToast("Error sending OTP. Please try again.", "error");
  }
});

verifyOtpButton.addEventListener("click", async () => {
  const otp = otpInput.value;
  if (!otp) {
      showToast("Please enter the OTP.", "error");
      return;
  }

  try {
      const response = await fetch("/api/v1/hotels/signup/verify", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: emailInput.value, otp }),
      });

      const data = await response.json();
      if (data.success) {
          showToast("OTP verified successfully!", "success");

          // Hide OTP input, verify button, and send OTP button after verification
          otpContainer.style.display = "none";
          sendOtpButton.style.display = "none";
          verifyOtpButton.style.display = "none";
          emailInput.disabled=true;
      } else {
          showToast(data.message, "error");
      }
  } catch (error) {
      showToast("Error verifying OTP. Please try again.", "error");
  }
});


// Handle signup
submitButton.addEventListener("click", async () => {
    const password = passwordInput.value;
    const rePassword = rePasswordInput.value;

    if (!password || !rePassword) {
        showToast("Please enter both password fields.", "error");
        return;
    }

    if (password !== rePassword) {
        showToast("Passwords do not match.", "error");
        return;
    }
    if(!emailInput.disabled)
    {
      showToast("Please Verify Your email Before Sign in","error");
      return;
    }
    try {
        const response = await fetch("/api/v1/hotels/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: emailInput.value, password,retype:rePassword }),
        });

        const data = await response.json();
        if (data.success) {
            showToast("Sign up successful! You can log in now.", "success");
            // Redirect or reset the form as needed
            setTimeout(() => {
                window.location.href = "./index.html"; // Redirect to login page
            }, 900);
        } else {
            showToast(data.message, "error");
        }
    } catch (error) {
        showToast("Error signing up. Please try again.", "error");
    }
});
