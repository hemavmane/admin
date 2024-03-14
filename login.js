const LoginButton = document.querySelector(".btn2");
const Email = document.querySelector(".email");
const Password = document.querySelector(".password");


LoginButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("password", Password.value);
    formData.append("email", Email.value);
    formData.append("status", "online");
    try {
 
        const response = await fetch("https://assesmentmarch.onrender.com/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data) {
            window.location.href = "./product.html";
            localStorage.setItem("userdata",data)
        } else {
            console.error(data.error);
        }
    } catch (err) {
        console.error(err);
    }
});
