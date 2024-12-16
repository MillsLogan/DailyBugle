import { API_ROUTES, ROUTES } from '../../constants.js';
import { LoginView } from './login.view.js';

export class LoginController {
    constructor(user) {
        if (!user.isAnonymous) {
            window.location.href = ROUTES.HOME;
        }
        this.view = new LoginView();
    }

    async render(parentElement) {
        this.view.render(parentElement);
        this.attachEventListeners();
    }

    attachEventListeners() {
        const form = document.getElementById("loginForm");
        form.addEventListener("submit", this.submitForm.bind(this));
    }

    submitForm(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {
            username: formData.get("username"),
            password: formData.get("password")
        }
        if (this.validateUsername(data.username) && this.validatePassword(data.password)) {
            this.login(data);
        }
    }

    validateUsername(username) {
        username = username.trim();
        if (username.length === 0) {
            this.view.showUsernameError("Username is required");
        } else if (username.length < 3) {
            this.view.showUsernameError("Username must be at least 3 characters");
        } else {
            this.view.removeError();
            return true;
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
            return true;
        }
    }

    async login(data) {
        fetch(API_ROUTES.AUTH + "login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.status === 200) {
                window.location.href = ROUTES.HOME;
            } else {
                console.log(response);
                this.view.showLoginError("Invalid username or password");
            }
        });
    }

    static async logout() {
        fetch(API_ROUTES.AUTH + "logout", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            window.location.href = ROUTES.HOME;
            window.location.reload();
        });
    }
}