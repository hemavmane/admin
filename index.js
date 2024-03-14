const firstName = document.querySelector(".firstname");
const Email = document.querySelector(".email");
const Phone = document.querySelector(".phone");
const Password = document.querySelector(".password");
const SubmitBtn = document.querySelector(".btn");



SubmitBtn.addEventListener("click", async e => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("username", firstName.value);
  formData.append("password", Password.value);
  formData.append("email", Email.value);
   formData.append("status","offline")
  try {
    const response = await fetch("https://assesmentmarch.onrender.com/api/adduser", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (data) {
      firstName.value = ""
      Password.value = ""
      Email.value = ""
      window.location.href = "Login.html"
    }
  } catch (err) {
    console.error(err);
  }
});


