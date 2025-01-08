"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Form = void 0;
const auth_utils_1 = require("../../utils/auth-utils");
const auth_service_1 = require("../../services/auth-service");
class Form {
    constructor(page) {
        this.commonErrorElement = null;
        this.processElement = null;
        this.rememberMeElement = null;
        this.fields = [];
        this.page = page;
        if (localStorage.getItem('accessToken')) {
            location.href = '#/';
            return;
        }
        this.commonErrorElement = document.getElementById('common-error');
        this.processElement = document.getElementById('process-button');
        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            },
        ];
        if (this.page === 'signup') {
            this.fields.unshift({
                name: 'fullName',
                id: 'fullName',
                element: null,
                regex: /^[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+(?:\s[А-ЯЁ][а-яё]+)?$/,
                valid: false,
            });
            this.fields.push({
                name: 'passwordRepeat',
                id: 'passwordRepeat',
                element: null,
                regex: /.*/,
                valid: false,
            });
        }
        this.fields.forEach((item) => {
            item.element = document.getElementById(item.id);
            if (item.element) {
                item.element.onchange = () => {
                    this.validateField(item, item.element);
                };
            }
        });
        if (this.page === 'login') {
            this.rememberMeElement = document.getElementById('rememberMe');
        }
        if (this.processElement) {
            this.processElement.addEventListener('click', this.processForm.bind(this));
        }
    }
    validateField(field, element) {
        if (!element) {
            return;
        }
        if (field.name === 'passwordRepeat') {
            const passwordRepeatInvalidElement = document.getElementById('passwordRepeatInvalid');
            const passwordField = this.fields.find((item) => item.name === 'password');
            if (passwordField && passwordField.element) {
                if (!element.value || element.value !== passwordField.element.value) {
                    if (passwordRepeatInvalidElement) {
                        passwordRepeatInvalidElement.style.display = 'block';
                        passwordRepeatInvalidElement.innerText = "Пароли должны совпадать";
                    }
                    element.classList.add('is-invalid');
                    field.valid = false;
                }
                else {
                    if (passwordRepeatInvalidElement) {
                        passwordRepeatInvalidElement.style.display = 'none';
                    }
                    element.classList.remove('is-invalid');
                    field.valid = true;
                }
            }
        }
        else if (!element.value || (field.regex && !element.value.match(field.regex))) {
            element.classList.add('is-invalid');
            field.valid = false;
        }
        else {
            element.classList.remove('is-invalid');
            field.valid = true;
        }
        this.validateForm();
    }
    ;
    validateForm() {
        const validForm = this.fields.every((item) => item.valid);
        if (this.processElement) {
            if (validForm) {
                this.processElement.removeAttribute('disabled');
            }
            else {
                this.processElement.setAttribute('disabled', 'disabled');
            }
        }
        return validForm;
    }
    ;
    extractNameAndLastName(fullName) {
        const parts = fullName.trim().split(/\s+/); // Разделяем по пробелам
        const lastName = parts[0] || ''; // Второе слово — фамилия
        const name = parts[1] || ''; // Первое слово — имя
        return { name, lastName };
    }
    async processForm() {
        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';
        }
        if (this.validateForm()) {
            let email = null;
            let password = null;
            let name = null;
            let lastName = null;
            // let {name, lastName}: string | null;
            const emailField = this.fields.find((item) => item.name === 'email');
            const passwordField = this.fields.find((item) => item.name === 'password');
            if (emailField && (emailField === null || emailField === void 0 ? void 0 : emailField.element) && passwordField && (passwordField === null || passwordField === void 0 ? void 0 : passwordField.element)) {
                email = emailField.element.value;
                password = passwordField.element.value;
            }
            if (this.page === 'signup') {
                // Извлечение имени и фамилии
                const nameField = this.fields.find((item) => item.name === 'fullName');
                if (nameField && (nameField === null || nameField === void 0 ? void 0 : nameField.element)) {
                    ({ name, lastName } = this.extractNameAndLastName(nameField.element.value));
                }
                let passwordRepeat = null;
                const passwordRepeatField = this.fields.find((item) => item.name === 'passwordRepeat');
                if (passwordRepeatField && (passwordRepeatField === null || passwordRepeatField === void 0 ? void 0 : passwordRepeatField.element)) {
                    passwordRepeat = passwordRepeatField.element.value;
                }
                try {
                    const signupResult = await auth_service_1.AuthService.signup({
                        name: name,
                        lastName: lastName,
                        email: email,
                        password: password,
                        passwordRepeat: passwordRepeat,
                    });
                    if (signupResult && 'error' in signupResult) {
                        // Ошибка
                        if (this.commonErrorElement) {
                            this.commonErrorElement.style.display = 'block';
                        }
                        return;
                    }
                }
                catch (error) {
                    return console.log(error);
                }
            }
            try {
                const body = {
                    email: email,
                    password: password,
                    rememberMe: false,
                };
                if (this.rememberMeElement && this.rememberMeElement.checked) {
                    body.rememberMe = true;
                }
                const loginResult = await auth_service_1.AuthService.login(body);
                if (loginResult) {
                    if ('tokens' in loginResult && 'user' in loginResult) {
                        // Успешный ответ
                        auth_utils_1.AuthUtils.setToken(loginResult.tokens.accessToken, loginResult.tokens.refreshToken);
                        auth_utils_1.AuthUtils.setUserInfo({
                            name: loginResult.user.name,
                            lastName: loginResult.user.lastName,
                            id: loginResult.user.id,
                        });
                    }
                    location.href = '#/';
                    return;
                }
                else {
                    // Ошибка
                    if (this.commonErrorElement) {
                        this.commonErrorElement.style.display = 'block';
                    }
                    return;
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    ;
}
exports.Form = Form;
