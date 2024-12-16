import { LoginFormElement } from "../../components/loginForm/loginForm.view.js";


export class LoginView {
    constructor() {
        this.usernameField = LoginFormElement.usernameField();
        this.passwordField = LoginFormElement.passwordField();
        this.loginError = LoginFormElement.getError();
    }

    static getFormElement() {
        const form = document.createElement("form");
        form.setAttribute("id", "loginForm");
        form.classList.add("col-5");
        form.classList.add("mx-auto");
        form.classList.add("my-5");
        form.classList.add("text-center");
        form.classList.add("loginContainer");
        form.classList.add("px-5");
        form.classList.add("py-1");
        return form;
    }

    render(parentContainer) {
        const form = LoginView.getFormElement();

        const title = document.createElement("h2");
        title.innerHTML = "Login";
        title.classList.add("text-center");
        title.classList.add("mb-3");
        title.classList.add("display-6");
        title.classList.add("border-bottom");
        title.classList.add("border-2");
        title.classList.add("pb-2");

        const submitButton = LoginFormElement.getSubmitButton("Login");

        const getRegisterButton = LoginView.getRegisterButton();
        
        form.appendChild(title);
        form.appendChild(this.loginError);
        form.appendChild(this.usernameField.formGroup);
        form.appendChild(this.passwordField.formGroup);
        form.appendChild(submitButton);
        form.appendChild(getRegisterButton);
        parentContainer.appendChild(form);
    }

    static getRegisterButton() {
        const register = document.createElement("p");
        register.innerHTML = "Don't have an account? <a href='#register'>Register here.</a>";
        return register;
    }

    showLoginError(message) {
        this.loginError.innerHTML = message;
        this.loginError.style.display = "block";
    }

    removeError() {
        this.loginError.style.display = "none";
        this.usernameField.removeErrorMessage();
        this.passwordField.removeErrorMessage();
    }

    showUsernameError(message) {
        this.usernameField.showErrorMessage(message);
    }

    showPasswordError(message) {
        this.passwordField.showErrorMessage(message);
    }
}