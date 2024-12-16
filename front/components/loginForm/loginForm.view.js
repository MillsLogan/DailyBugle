export class LoginFormElement {
    constructor(formGroup, input, helpText) {
        this.formGroup = formGroup;
        this.input = input;
        this.helpText = helpText;
    }

    showErrorMessage(message) {
        this.helpText.innerHTML = message;
        this.helpText.style.display = "block";
        this.input.classList.add("is-invalid");
    }

    removeErrorMessage() {
        this.helpText.innerHTML = "";
        this.helpText.style.display = "none";
        this.input.classList.remove("is-invalid");
    }

    getValue() {
        return this.input.value;
    }
    
    static createInputElement(type, name, placeholder, help) {
        const formGroup = document.createElement("div");
        formGroup.classList.add("form-group");
        formGroup.classList.add("mb-4");

        const label = document.createElement("label");
        label.setAttribute("for", name);
        label.innerHTML = name.charAt(0).toUpperCase() + name.slice(1);

        const input = document.createElement("input");
        input.setAttribute("type", type);
        input.setAttribute("name", name);
        input.setAttribute("placeholder", placeholder);
        input.classList.add("form-control");
        input.classList.add("mb-2");
        input.required = true;
        input.setAttribute("autocomplete", "on");

        const helpText = document.createElement("div");
        helpText.setAttribute("id", `${name}Help`);
        helpText.classList.add("form-text");
        helpText.innerHTML = help;

        formGroup.appendChild(label);
        formGroup.appendChild(input);
        formGroup.appendChild(helpText);

        return new LoginFormElement(formGroup, input, helpText);
    }

    static usernameField() {
        return LoginFormElement.createInputElement("input", 
            "username", "Please enter your username", 
            "Usernames should only use letters and numbers");
    }

    static passwordField() {
        return LoginFormElement.createInputElement("password", 
            "password", "Please enter your password", 
            "Passwords should be at least 8 characters long");
    }

    static getError() {
        const error = document.createElement("div");
        error.setAttribute("id", "error");
        error.classList.add("alert");
        error.classList.add("alert-danger");
        error.classList.add("mx-auto");
        error.innerHTML = "Invalid username or password";

        return error;
    }

    static getSubmitButton(text) {
        const submit = document.createElement("button");
        submit.setAttribute("type", "submit");
        submit.classList.add("btn");
        submit.classList.add("btn-success");
        submit.classList.add("col-12");
        submit.innerHTML = text;

        return submit;
    }   
}