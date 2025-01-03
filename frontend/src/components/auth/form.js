import {AuthUtils} from "../../utils/auth-utils.js";
import {AuthService} from "../../services/auth-service.js";

export class Form {
    constructor(page) {
        if (localStorage.getItem('accessToken')) {
            return location.href = '#/';
        }
        this.commonErrorElement = document.getElementById('common-error');
        this.processElement = document.getElementById('process-button');
        this.page = page;
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
            this.fields.unshift(
                {
                    name: 'fullName',
                    id: 'fullName',
                    element: null,
                    regex: /^[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+(?:\s[А-ЯЁ][а-яё]+)?$/,
                    valid: false,
                },)
            this.fields.push(
                {
                    name: 'passwordRepeat',
                    id: 'passwordRepeat',
                    element: null,
                    valid: false,
                },)
        }

        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = () => {
                this.validateField(item, item.element);
            }
        });

        if (this.page === 'login') {
            this.rememberMeElement = document.getElementById('rememberMe');
        }

        this.processElement.addEventListener('click', this.processForm.bind(this));
    }

    validateField(field, element) {
        if (field.name === 'passwordRepeat') {
            const passwordRepeatInvalidElement = document.getElementById('passwordRepeatInvalid');
            const passwordField = this.fields.find(item => item.name === 'password');
            if (!element.value || element.value !== passwordField.element.value) {
                passwordRepeatInvalidElement.style.display = 'block';
                passwordRepeatInvalidElement.innerText = "Пароли должны совпадать";
                element.classList.add('is-invalid');
                field.valid = false;
            } else {
                passwordRepeatInvalidElement.style.display = 'none';
                element.classList.remove('is-invalid');
                field.valid = true;
            }
        } else if (!element.value || !element.value.match(field.regex)) {
            element.classList.add('is-invalid');
            field.valid = false;
        } else {
            element.classList.remove('is-invalid');
            field.valid = true;
        }
        this.validateForm();
    };

    validateForm() {
        const validForm = this.fields.every(item => item.valid);
        if (validForm) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
        return validForm;
    };

    extractNameAndLastName(fullName) {
        const parts = fullName.trim().split(/\s+/); // Разделяем по пробелам
        const lastName = parts[0] || ''; // Второе слово — фамилия
        const name = parts[1] || ''; // Первое слово — имя
        return {name, lastName};
    }

    async processForm() {
        this.commonErrorElement.style.display = 'none';
        if (this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;

            if (this.page === 'signup') {
                // Извлечение имени и фамилии
                const nameField = this.fields.find(item => item.name === 'fullName');
                const {name, lastName} = this.extractNameAndLastName(nameField.element.value);

                try {
                    const signupResult = await AuthService.signup({
                        name: name,
                        lastName: lastName,
                        email: email,
                        password: password,
                        passwordRepeat: this.fields.find(item => item.name === 'passwordRepeat').element.value,
                    });
                    if (!signupResult) {
                        this.commonErrorElement.style.display = 'block';
                        return;
                    }
                } catch (error) {
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

                const loginResult = await AuthService.login(body);
                if (loginResult) {
                    AuthUtils.setToken(loginResult.tokens.accessToken, loginResult.tokens.refreshToken);
                    AuthUtils.setUserInfo({
                        name: loginResult.user.name,
                        lastName: loginResult.user.lastName,
                        id: loginResult.user.id,
                    });
                    location.href = '#/';
                } else {
                    this.commonErrorElement.style.display = 'block';
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        }
    };
}

