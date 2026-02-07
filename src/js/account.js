document.addEventListener('DOMContentLoaded', () => {
    const dom = {
        // sign-up
        signForm: document.querySelector('#sign-up-form'),
        signEmail: document.querySelector('#sign-up-form #email'),
        signPassword: document.querySelector('#sign-up-form #password'),
        signRepeatPassword: document.querySelector('#repeat-password'),
        signError: document.querySelector('#sign-up-error-message'),
        // login
        loginForm: document.querySelector('#login-form'),
        loginEmail: document.querySelector('#login-form #email'),
        loginPassword: document.querySelector('#login-form #password'),
        loginError: document.querySelector('#login-error-message')
    };
    // =====================
    // SIGN-UP
    // =====================
    if (dom.signForm) {
        dom.signForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = dom.signEmail.value.trim();
            const password = dom.signPassword.value.trim();
            const repeatPassword = dom.signRepeatPassword.value.trim();
            dom.signError.style.display = 'none';
            if (!email || !password || !repeatPassword) {
                signShowError('All fields are required');
                return;
            }
            if (password !== repeatPassword) {
                signShowError('Passwords do not match');
                return;
            }
            localStorage.setItem(
                'user',
                JSON.stringify({ email, password })
            );
            window.location.href = 'login.html';
        });
    }
    function signShowError(text) {
        dom.signError.textContent = text;
        dom.signError.style.display = 'block';
    }
    // =====================
    // LOGIN
    // =====================
    if (dom.loginForm) {
        dom.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = dom.loginEmail.value.trim();
            const password = dom.loginPassword.value.trim();
            const savedUser = JSON.parse(localStorage.getItem('user'));
            if (!savedUser) {
                loginShowError('User not found');
                return;
            }
            if (
                email === savedUser.email &&
                password === savedUser.password
            ) {
                window.location.href = 'index.html';
            } else {
                loginShowError('Invalid email or password');
            }
        });
    }

    function loginShowError(text) {
        dom.loginError.textContent = text;
        dom.loginError.style.display = 'block';
    }
});