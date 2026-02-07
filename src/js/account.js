document.addEventListener('DOMContentLoaded', () => {
    const domElement = {
        signUpForm: document.querySelector('#sign-up-form'),
        passwordField: document.querySelector('#password'),
        repeatPasswordField: document.querySelector('#repeat-password'),
        signUpFormBtn: document.querySelector('#sign-up-form-button'),
        errorMessage: document.querySelector('#error-message')
    }
    domElement.signUpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(domElement.signUpForm);
        const data = Object.fromEntries(formData);
        localStorage.setItem('profile', JSON.stringify(data));
    });
    const savedData = JSON.parse(localStorage.getItem('profile'));
    domElement.signUpFormBtn.addEventListener("click", () => {
        if (savedData.password === "" && savedData.repeatPassword === "" && savedData.email === "") {
            domElement.passwordField.style.borderColor = "red";
            domElement.repeatPasswordField.style.borderColor = "red";
            domElement.errorMessage.style.display = "block";
        }
        else if (savedData.password === savedData.repeatPassword) {
            window.location.href = 'login.html';
            domElement.passwordField.style.borderColor = "white";
            domElement.repeatPasswordField.style.borderColor = "white";
            domElement.errorMessage.style.display = "none";
        } else {
            domElement.passwordField.style.borderColor = "red";
            domElement.repeatPasswordField.style.borderColor = "red";
            domElement.errorMessage.style.display = "block";
        }
    });
    
});