const loginForm = document.getElementById('login-form');
const emailError = document.getElementById('email-error');
const passError = document.getElementById('password-error');
const error = document.getElementById('errorMsg');
const alertMsg = document.getElementById('error');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('pass');

function setCookie(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


function login(email,password) {
    if(!email && !password) {
        alertMsg.style.display = "block";
        emailError.innerHTML = 'Email is required.';
        passError.innerHTML = 'Password is required.';
        error.innerHTML = "Enter your email and password";
        emailInput.classList.add('hasError');
        passwordInput.classList.add('hasError');
    } else if(email === 'admin@gmail.com' && password === "^VX(FC?Af#r6`]N=rvW>ht]5V") {
        document.cookie = "role=admin; path=/";
        window.location = 'dashboard.html';
    }else {
        alertMsg.style.display = "block";
        error.innerHTML = "Incorrect email or password"
    }
}

loginForm.addEventListener("submit", (e)=> {
    e.preventDefault();
    const email = document.forms['login-form']['email'].value;
    const password = document.forms['login-form']['password'].value;
    login(email,password)
});
