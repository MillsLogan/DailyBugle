export class RegisterView {
    constructor() {
        this.usernameField = null;
        this.passwordField = null;
        this.confirmPasswordField = null;
    }

    getForm() {
        const form = document.createElement("form");
        form.setAttribute("id", "registerForm");
        form.classList.add("col-5");
        form.classList.add("mx-auto");
        form.classList.add("my-5");
        form.classList.add("text-center");
        form.classList.add("loginContainer");
        form.classList.add("px-5");
        form.classList.add("py-1");
        return form;
    }

    getError() {
        const error = document.createElement("div");
        error.setAttribute("id", "error");
        error.classList.add("alert");
        error.classList.add("alert-danger");
        error.classList.add("mx-auto");
        error.innerHTML = "Invalid username or password";

        this.registerError = error;

        return error;
    }

    getUsernameInput() {
        const formGroup = document.createElement("div");
        formGroup.classList.add("form-group");
        formGroup.classList.add("mb-4");

        const label = document.createElement("label");
        label.setAttribute("for", "username");
        label.innerHTML = "Username";

        const username = document.createElement("input");
        username.setAttribute("type", "input");
        username.setAttribute("name", "username");
        username.setAttribute("placeholder", "Please enter your username");
        username.classList.add("form-control");
        username.classList.add("mb-2");
        username.required = true;
        username.setAttribute("autocomplete", "on");

        this.usernameField = username;

        const usernameHelp = document.createElement("div");
        usernameHelp.setAttribute("id", "usernameHelp");
        usernameHelp.classList.add("form-text");
        usernameHelp.innerHTML = "Usernames should only use letters and numbers";

        formGroup.appendChild(label);
        formGroup.appendChild(username);
        formGroup.appendChild(usernameHelp);

        return formGroup;
    }

    getPasswordInput() {
        const formGroup = document.createElement("div");
        formGroup.classList.add("form-group");
        formGroup.classList.add("mb-4");

        const label = document.createElement("label");
        label.setAttribute("for", "password");
        label.innerHTML = "Password";

        const password = document.createElement("input");
        password.setAttribute("type", "password");
        password.setAttribute("name", "password");
        password.setAttribute("placeholder", "Please enter your password");
        password.classList.add("form-control");
        password.classList.add("mb-2");
        password.required = true;
        password.setAttribute("autocomplete", "on");

        this.passwordField = password;

        const passwordHelp = document.createElement("div");
        passwordHelp.setAttribute("id", "passwordHelp");
        passwordHelp.classList.add("form-text");
        passwordHelp.innerHTML = "Passwords should be at least 8 characters long";

        formGroup.appendChild(label);
        formGroup.appendChild(password);
        formGroup.appendChild(passwordHelp);

        return formGroup;
    }

    getConfirmPasswordInput() {
        const formGroup = document.createElement("div");
        formGroup.classList.add("form-group");
        formGroup.classList.add("mb-2");

        const label = document.createElement("label");
        label.setAttribute("for", "confirmPassword");
        label.innerHTML = "Confirm Password";

        const confirmPassword = document.createElement("input");
        confirmPassword.setAttribute("type", "password");
        confirmPassword.setAttribute("name", "confirmPassword");
        confirmPassword.setAttribute("placeholder", "Please confirm your password");
        confirmPassword.classList.add("form-control");
        confirmPassword.classList.add("mb-2");
        confirmPassword.required = true;
        confirmPassword.setAttribute("autocomplete", "on");

        this.confirmPasswordField = confirmPassword;

        const confirmPasswordHelp = document.createElement("div");
        confirmPasswordHelp.setAttribute("id", "confirmPasswordHelp");
        confirmPasswordHelp.classList.add("form-text");
        confirmPasswordHelp.innerHTML = "Passwords should match";

        formGroup.appendChild(label);
        formGroup.appendChild(confirmPassword);
        formGroup.appendChild(confirmPasswordHelp);

        return formGroup;
    }

    getSubmitButton() {
        const submit = document.createElement("button");
        submit.setAttribute("type", "submit");
        submit.classList.add("btn");
        submit.classList.add("btn-success");
        submit.classList.add("col-12");
        submit.innerHTML = "Create Account";
        return submit;
    }   

    render(parentContainer) {
        const form = this.getForm();

        const title = document.createElement("h2");
        title.innerHTML = "Register";
        title.classList.add("text-center");
        title.classList.add("mb-3");
        title.classList.add("display-6");
        title.classList.add("border-bottom");
        title.classList.add("border-2");
        title.classList.add("pb-2");

        const error = this.getError();

        const username = this.getUsernameInput();

        const password = this.getPasswordInput();

        const confirmPassword = this.getConfirmPasswordInput();

        const submitButton = this.getSubmitButton();

        const getRegisterButton = this.getRegisterButton();
        
        form.appendChild(title);
        form.appendChild(error);
        form.appendChild(username);
        form.appendChild(password);
        form.appendChild(confirmPassword);
        form.appendChild(submitButton);
        form.appendChild(getRegisterButton);
        parentContainer.appendChild(form);
    }

    getRegisterButton() {
        const register = document.createElement("p");
        register.innerHTML = "Don't have an account? <a href='#register'>Register here.</a>";
        return register;
    }

    showRegisterError(message) {
        this.registerError.innerHTML = message;
        this.registerError.style.display = "block";
    }

    hideRegisterError() {
        const error = document.getElementById("error");
        error.classList.add("d-none");
    }

    showUsernameError(message) {
        const usernameHelp = document.getElementById("usernameHelp");
        usernameHelp.innerHTML = message;
        usernameHelp.style.display = "block";
        this.usernameField.classList.add("is-invalid");
    }

    showPasswordError(message) {
        const passwordHelp = document.getElementById("passwordHelp");
        passwordHelp.innerHTML = message;
        passwordHelp.style.display = "block";
        this.passwordField.classList.add("is-invalid");
    }

    showConfirmPasswordError(message) {
        const confirmPasswordHelp = document.getElementById("confirmPasswordHelp");
        confirmPasswordHelp.innerHTML = message;
        confirmPasswordHelp.style.display = "block";
        this.confirmPasswordField.classList.add("is-invalid");
    }

    removeError() {
        const usernameHelp = document.getElementById("usernameHelp");
        usernameHelp.style.display = "none";
        this.usernameField.classList.remove("is-invalid");

        this.registerError.style.display = "none";

        const passwordHelp = document.getElementById("passwordHelp");
        passwordHelp.style.display = "none";
        this.passwordField.classList.remove("is-invalid");
    }
}