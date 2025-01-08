"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const main_1 = require("./components/main");
const incomes_1 = require("./components/incomes/incomes");
const expenses_1 = require("./components/expenses/expenses");
const operations_list_1 = require("./components/operations/operations-list");
const auth_utils_1 = require("./utils/auth-utils");
const logout_1 = require("./components/auth/logout");
const form_1 = require("./components/auth/form");
const category_creating_1 = require("./components/categories/category-creating");
const operation_creating_1 = require("./components/operations/operation-creating");
const category_edit_1 = require("./components/categories/category-edit");
const operation_edit_1 = require("./components/operations/operation-edit");
const operation_delete_1 = require("./components/operations/operation-delete");
const balance_1 = require("./components/balance");
class Router {
    constructor() {
        this.burgerElement = null;
        this.sidebarElement = null;
        this.dropdownMenuElement = null;
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.toggleElement = null;
        this.activeBlockElement = null;
        this.listElement = null;
        this.collapsedSvgElement = null;
        this.currentRoute = '#/login';
        this.initEvents();
        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'src/templates/pages/main.html',
                useLayout: 'src/templates/layout.html',
                load: () => {
                    new main_1.Main();
                    new balance_1.Balance();
                },
                styles: [
                    'layout.css',
                    'index.css',
                    'adaptive.css',
                ],
            },
            {
                route: '#/login',
                title: 'Вход',
                template: 'src/templates/pages/auth/login.html',
                useLayout: '',
                load: () => {
                    new form_1.Form('login');
                },
                styles: [
                    'auth.css',
                ],
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'src/templates/pages/auth/signup.html',
                useLayout: '',
                load: () => {
                    new form_1.Form('signup');
                },
                styles: [
                    'auth.css',
                ],
            },
            {
                route: '#/logout',
                load: () => {
                    new logout_1.Logout();
                }
            },
            {
                route: '#/operations',
                title: 'Доходы и расходы',
                template: 'src/templates/pages/operations/list.html',
                useLayout: 'src/templates/layout.html',
                load: () => {
                    new operations_list_1.OperationsList(this.parseHash.bind(this));
                    new balance_1.Balance();
                },
                styles: [
                    'layout.css',
                    'index.css',
                    'adaptive.css',
                ],
            },
            {
                route: '#/operations/edit',
                title: 'Доходы и расходы',
                template: 'src/templates/pages/operations/edit.html',
                useLayout: 'src/templates/layout.html',
                load: () => {
                    new operation_edit_1.OperationEdit(this.parseHash.bind(this));
                    new balance_1.Balance();
                },
                styles: [
                    'layout.css',
                    'index.css',
                    'adaptive.css',
                ],
            },
            {
                route: '#/operations/creating',
                title: 'Доходы и расходы',
                template: 'src/templates/pages/operations/creating.html',
                useLayout: 'src/templates/layout.html',
                load: () => {
                    new operation_creating_1.OperationCreating(this.parseHash.bind(this));
                    new balance_1.Balance();
                },
                styles: [
                    'layout.css',
                    'index.css',
                    'adaptive.css',
                ],
            },
            {
                route: '#/operations/delete',
                title: 'Доходы и расходы',
                template: 'src/templates/pages/operations/list.html',
                useLayout: 'src/templates/layout.html',
                load: () => {
                    new operation_delete_1.OperationDelete(this.parseHash.bind(this));
                    new balance_1.Balance();
                },
                styles: [
                    'layout.css',
                    'index.css',
                    'adaptive.css',
                ],
            },
            {
                route: '#/incomes',
                title: 'Доходы',
                template: 'src/templates/pages/incomes/incomes.html',
                useLayout: 'src/templates/layout.html',
                load: () => {
                    new incomes_1.Incomes();
                    new balance_1.Balance();
                },
                styles: [
                    'layout.css',
                    'index.css',
                    'adaptive.css',
                ],
            },
            {
                route: '#/income/edit',
                title: 'Редактирование доходов',
                template: 'src/templates/pages/incomes/edit.html',
                useLayout: 'src/templates/layout.html',
                load: () => {
                    new category_edit_1.CategoryEdit(this.parseHash.bind(this));
                    new balance_1.Balance();
                },
                styles: [
                    'layout.css',
                    'index.css',
                    'adaptive.css',
                ],
            },
            {
                route: '#/income/creating',
                title: 'Создание дохода',
                template: 'src/templates/pages/incomes/creating.html',
                useLayout: 'src/templates/layout.html',
                load: () => {
                    new category_creating_1.CategoryCreating();
                    new balance_1.Balance();
                },
                styles: [
                    'layout.css',
                    'index.css',
                    'adaptive.css',
                ],
            },
            {
                route: '#/expenses',
                title: 'Расходы',
                template: 'src/templates/pages/expenses/expenses.html',
                useLayout: 'src/templates/layout.html',
                load: () => {
                    new expenses_1.Expenses();
                    new balance_1.Balance();
                },
                styles: [
                    'layout.css',
                    'index.css',
                    'adaptive.css',
                ],
            },
            {
                route: '#/expense/edit',
                title: 'Редактирование расходов',
                template: 'src/templates/pages/expenses/edit.html',
                useLayout: 'src/templates/layout.html',
                load: () => {
                    new category_edit_1.CategoryEdit(this.parseHash.bind(this));
                    new balance_1.Balance();
                },
                styles: [
                    'layout.css',
                    'index.css',
                    'adaptive.css',
                ],
            },
            {
                route: '#/expense/creating',
                title: 'Создание расходов',
                template: 'src/templates/pages/expenses/creating.html',
                useLayout: 'src/templates/layout.html',
                load: () => {
                    new category_creating_1.CategoryCreating();
                    new balance_1.Balance();
                },
                styles: [
                    'layout.css',
                    'index.css',
                    'adaptive.css',
                ],
            },
        ];
    }
    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
    }
    parseHash() {
        const hash = window.location.hash; // Получаем hash из адресной строки
        const [routeWithHash, queryString] = hash.split('?'); // Разделяем на маршрут и параметры
        const params = queryString ? Object.fromEntries(new URLSearchParams(queryString).entries()) : null; // Если параметры есть, создаем объект URLSearchParams
        return {
            routeWithHash, // Маршрут с символом #
            params // Объект URLSearchParams для извлечения параметров
        };
    }
    async activateRoute() {
        const { routeWithHash } = this.parseHash(); // Получаем текущий маршрут
        const previousRoute = this.currentRoute; // Сохраняем предыдущий маршрут
        this.currentRoute = routeWithHash; // Обновляем текущий маршрут
        // Находим объект маршрута для предыдущего
        const previousRouteObject = this.routes.find(route => route.route === previousRoute);
        if (previousRouteObject) {
            if (previousRouteObject.styles && previousRouteObject.styles.length > 0) {
                // находим и удаляем старые стили
                previousRouteObject.styles.forEach((style) => {
                    const linkElement = document.querySelector(`link[href='src/styles/${style}']`);
                    if (linkElement) {
                        linkElement.remove();
                    }
                });
            }
        }
        const newRoute = this.routes.find((item) => {
            // const {routeWithHash}: string = this.parseHash(); //получаем маршрут без параметров
            return item.route === routeWithHash;
        });
        if (newRoute) {
            if (newRoute.title && this.titlePageElement) {
                this.titlePageElement.innerText = newRoute.title;
            }
            if (newRoute.styles && newRoute.styles.length > 0) {
                newRoute.styles.forEach((style) => {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = `src/styles/${style}`;
                    document.head.appendChild(link);
                });
            }
            if (newRoute.template) {
                let contentBlock = this.contentPageElement;
                if (this.contentPageElement) {
                    this.contentPageElement.classList.remove('content-center-auth');
                }
                if (newRoute.useLayout) {
                    if (this.contentPageElement) {
                        this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    }
                    contentBlock = document.getElementById('content-layout');
                    const profileUserElement = document.getElementById('profile-user');
                    const userInfo = auth_utils_1.AuthUtils.getUserInfo();
                    if (profileUserElement) {
                        if (userInfo && userInfo.name && userInfo.lastName) {
                            profileUserElement.innerText = `${userInfo.name} ${userInfo.lastName}`;
                        }
                    }
                    this.burgerElement = document.getElementById("burger");
                    this.sidebarElement = document.getElementById("sidebar");
                    this.toggleElement = document.getElementById('toggle');
                    this.activeBlockElement = document.getElementById('active-block');
                    this.listElement = document.getElementById('dashboard-collapse');
                    this.collapsedSvgElement = document.getElementById('collapsed-svg');
                    const userIconElement = document.getElementById("user-icon");
                    this.dropdownMenuElement = document.getElementById("dropdown-menu");
                    if (userIconElement) {
                        userIconElement.addEventListener('click', this.showLogout.bind(this));
                    }
                    if (this.burgerElement) {
                        this.burgerElement.addEventListener('click', this.showSidebar.bind(this));
                    }
                    this.activateMenuItem(newRoute);
                }
                else {
                    if (this.contentPageElement) {
                        this.contentPageElement.classList.add('content-center-auth');
                    }
                }
                if (contentBlock) {
                    contentBlock.innerHTML = await fetch(newRoute.template).then(response => response.text());
                }
            }
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        }
        else {
            location.href = '#/login';
            console.log('No route found');
        }
    }
    activateMenuItem(route) {
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                if ((route.route.includes(href) && href !== '#/') || (route.route === "#/" && href === '#/')) {
                    link.classList.add('active');
                }
                else {
                    link.classList.remove('active');
                }
            }
            if (this.toggleElement && this.activeBlockElement && this.listElement && this.collapsedSvgElement) {
                if (route.route.includes('#/incomes') || route.route.includes('#/expenses')) {
                    this.toggleElement.classList.add('active');
                    this.activeBlockElement.classList.add('active-block');
                    this.toggleElement.classList.remove('collapsed');
                    this.listElement.classList.add('show');
                    this.collapsedSvgElement.classList.add('collapsed');
                }
                else {
                    this.toggleElement.classList.remove('active');
                    this.activeBlockElement.classList.remove('active-block');
                    this.toggleElement.classList.add('collapsed');
                    this.listElement.classList.remove('show');
                    this.collapsedSvgElement.classList.remove('collapsed');
                }
            }
        });
    }
    showSidebar() {
        if (this.sidebarElement && this.burgerElement) {
            this.sidebarElement.classList.toggle("d-none");
            this.sidebarElement.classList.toggle("d-flex");
            this.sidebarElement.classList.toggle("sidebar-background");
            this.burgerElement.classList.toggle("burger-margin");
        }
    }
    showLogout() {
        if (this.dropdownMenuElement) {
            this.dropdownMenuElement.classList.toggle('show');
        }
    }
}
exports.Router = Router;
