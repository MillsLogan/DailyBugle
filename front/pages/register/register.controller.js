import { API_ROUTES, ROUTES } from '../../constants.js';
import { RegisterView } from './register.view.js';

export class RegisterController {
    constructor(user) {
        if (!user.isAnonymous) {
            window.location.href = ROUTES.HOME;
        }

        this.view = new RegisterView();
    }

    async render(parentElement) {
        this.view.render(parentElement);
        this.attachEventListeners();
    }

    attachEventListeners() {
        const form = document.getElementById("registerForm");
        form.addEventListener("submit", this.submitForm.bind(this));
    }

    submitForm(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {
            username: formData.get("username"),
            password: formData.get("password"),
            confirmPassword: formData.get("confirmPassword")
        }
        this.validateUsername(data.username);
        this.validatePassword(data.password);
        this.validateConfirmPassword(data.password, data.confirmPassword);
        this.register(data);
    }

    validateUsername(username) {
        username = username.trim();
        if (username.length === 0) {
            this.view.showUsernameError("Username is required");
        } else if (username.length < 3) {
            this.view.showUsernameError("Username must be at least 3 characters");
        } else {
            this.view.removeError();
        }
    }

    validatePassword(password) {
        password = password.trim();
        if (password.length === 0) {
            this.view.showPasswordError("Password is required");
        } else if (password.length < 8) {
            this.view.showPasswordError("Password must be at least 8 characters");
        } else {
            this.view.removeError();
        }
    }

    validateConfirmPassword(password, confirmPassword) {
        confirmPassword = confirmPassword.trim();
        if (confirmPassword !== password) {
            this.view.showConfirmPasswordError("Passwords do not match");
        } else {
            this.view.removeError();
        }
    }

    async register(data) {
        fetch(API_ROUTES.AUTH + "register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: data.username, password: data.password})
        }).then(response => {
            if (response.status === 200) {
                window.location.href = ROUTES.HOME;
            } else {
                console.log(response);
                this.view.showRegisterError("Username already exists");
            }
        });
    }
}