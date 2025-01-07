import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../../services/auth-service";
import {LoginResponseType, SignupResponseType} from "../../types/auth-response.type";
import {FormFieldType} from "../../types/form-field.type";

export class Form {
    readonly commonErrorElement: HTMLElement | null;
    readonly processElement: HTMLElement | null;
    readonly rememberMeElement: HTMLElement | null;
    readonly page: 'signup' | 'login';
    private fields: FormFieldType[] = [];

    constructor(page: 'signup' | 'login') {
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

        this.fields.forEach((item: FormFieldType): void => {
            item.element = document.getElementById(item.id) as HTMLInputElement;
            if (item.element) {
                item.element.onchange = () => {
                    this.validateField(item, item.element);
                }
            }
        });

        if (this.page === 'login') {
            this.rememberMeElement = document.getElementById('rememberMe');
        }
        if (this.processElement) {
            this.processElement.addEventListener('click', this.processForm.bind(this));
        }
    }

    private validateField(field: FormFieldType, element: HTMLInputElement | null): void {
        if (!element) {
            return;
        }
        if (field.name === 'passwordRepeat') {
            const passwordRepeatInvalidElement: HTMLElement | null = document.getElementById('passwordRepeatInvalid');
            const passwordField: FormFieldType = this.fields.find((item: FormFieldType): boolean => item.name === 'password');
            if (passwordField.element) {
                if (!element.value || element.value !== passwordField.element.value) {
                    if (passwordRepeatInvalidElement) {
                        passwordRepeatInvalidElement.style.display = 'block';
                        passwordRepeatInvalidElement.innerText = "Пароли должны совпадать";
                    }
                    element.classList.add('is-invalid');
                    field.valid = false;
                } else {
                    if (passwordRepeatInvalidElement) {
                        passwordRepeatInvalidElement.style.display = 'none';
                    }
                    element.classList.remove('is-invalid');
                    field.valid = true;
                }
            }
        } else if (!element.value || (field.regex && !element.value.match(field.regex))) {
            element.classList.add('is-invalid');
            field.valid = false;
        } else {
            element.classList.remove('is-invalid');
            field.valid = true;
        }
        this.validateForm();
    };

    private validateForm(): boolean {
        const validForm: boolean = this.fields.every((item: FormFieldType) => item.valid);
        if (this.processElement) {
            if (validForm) {
                this.processElement.removeAttribute('disabled');
            } else {
                this.processElement.setAttribute('disabled', 'disabled');
            }
        }
        return validForm;
    };

    private extractNameAndLastName(fullName: string): {name: string, lastName: string} {
        const parts: string[] = fullName.trim().split(/\s+/); // Разделяем по пробелам
        const lastName: string = parts[0] || ''; // Второе слово — фамилия
        const name: string = parts[1] || ''; // Первое слово — имя
        return {name, lastName};
    }

    private async processForm(): Promise<any> {
        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';
        }
        if (this.validateForm()) {
            let email: string | null = null;
            let password: string | null = null;
            let {name, lastName}: string = null;
            const emailField: FormFieldType = this.fields.find((item: FormFieldType): boolean => item.name === 'email');
            const passwordField: FormFieldType = this.fields.find((item: FormFieldType): boolean => item.name === 'password');


            if (emailField?.element && passwordField?.element) {
                email = emailField.element.value;
                password = passwordField.element.value;
                }

            if (this.page === 'signup') {
                // Извлечение имени и фамилии
                const nameField: FormFieldType = this.fields.find((item: FormFieldType): boolean => item.name === 'fullName');
                if (nameField?.element) {
                    ({name, lastName} = this.extractNameAndLastName(nameField.element.value));
                }
                let passwordRepeat: string | null = null;
                const passwordRepeatField: FormFieldType = this.fields.find((item: FormFieldType): boolean => item.name === 'passwordRepeat');
                if (passwordRepeatField?.element) {
                    passwordRepeat = passwordRepeatField.element.value;
                }
                try {
                    const signupResult: SignupResponseType = await AuthService.signup({
                        name: name,
                        lastName: lastName,
                        email: email,
                        password: password,
                        passwordRepeat: passwordRepeat,
                    });
                    if ('error' in signupResult) {
                        // Ошибка
                        if (this.commonErrorElement) {
                            this.commonErrorElement.style.display = 'block';
                        }
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
                if (this.rememberMeElement && (this.rememberMeElement as HTMLInputElement).checked) {
                    body.rememberMe = true;
                }

                const loginResult: LoginResponseType = await AuthService.login(body);
                if (loginResult) {
                    if ('tokens' in loginResult && 'user' in loginResult) {
                        // Успешный ответ
                        AuthUtils.setToken(loginResult.tokens.accessToken, loginResult.tokens.refreshToken);
                        AuthUtils.setUserInfo({
                            name: loginResult.user.name,
                            lastName: loginResult.user.lastName,
                            id: loginResult.user.id,
                        });
                    }
                    location.href = '#/';
                    return;
                } else {
                    // Ошибка
                    if (this.commonErrorElement) {
                        this.commonErrorElement.style.display = 'block';
                    }
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        }
    };
}

