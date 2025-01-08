import {Main} from "./components/main";
import {Incomes} from "./components/incomes/incomes";
import {Expenses} from "./components/expenses/expenses";
import {OperationsList} from "./components/operations/operations-list";
import {AuthUtils} from "./utils/auth-utils";
import {Logout} from "./components/auth/logout";
import {Form} from "./components/auth/form";
import {CategoryCreating} from "./components/categories/category-creating";
import {OperationCreating} from "./components/operations/operation-creating";
import {CategoryEdit} from "./components/categories/category-edit";
import {OperationEdit} from "./components/operations/operation-edit";
import {OperationDelete} from "./components/operations/operation-delete";
import {Balance} from "./components/balance";
import {RouteType} from "./types/route.type";
import {UserInfoType} from "./types/user-info.type";

export class Router {
    readonly titlePageElement: HTMLElement | null;
    readonly contentPageElement: HTMLElement | null;
    private toggleElement: HTMLElement | null;
    private activeBlockElement: HTMLElement | null;
    private burgerElement: HTMLElement | null = null;
    private sidebarElement: HTMLElement | null = null;
    private dropdownMenuElement: HTMLElement | null = null;
    private listElement: HTMLElement | null;
    private collapsedSvgElement: HTMLElement | null;
    private currentRoute: string;
    private routes: RouteType[];

    constructor() {
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
                template: '/templates/pages/main.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Main();
                    new Balance();
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
                template: '/templates/pages/auth/login.html',
                useLayout: '',
                load: () => {
                    new Form('login');
                },
                styles: [
                    'auth.css',
                ],
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: '/templates/pages/auth/signup.html',
                useLayout: '',
                load: () => {
                    new Form('signup');
                },
                styles: [
                    'auth.css',
                ],
            },
            {
                route: '#/logout',
                load: () => {
                    new Logout();
                }
            },
            {
                route: '#/operations',
                title: 'Доходы и расходы',
                template: '/templates/pages/operations/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationsList(this.parseHash.bind(this));
                    new Balance();
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
                template: '/templates/pages/operations/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationEdit(this.parseHash.bind(this));
                    new Balance();
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
                template: '/templates/pages/operations/creating.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationCreating(this.parseHash.bind(this));
                    new Balance();
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
                template: '/templates/pages/operations/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationDelete(this.parseHash.bind(this));
                    new Balance();
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
                template: '/templates/pages/incomes/incomes.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Incomes();
                    new Balance();
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
                template: '/templates/pages/incomes/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CategoryEdit(this.parseHash.bind(this));
                    new Balance();
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
                template: '/templates/pages/incomes/creating.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CategoryCreating();
                    new Balance();
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
                template: '/templates/pages/expenses/expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Expenses();
                    new Balance();
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
                template: '/templates/pages/expenses/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CategoryEdit(this.parseHash.bind(this));
                    new Balance();
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
                template: '/templates/pages/expenses/creating.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new CategoryCreating();
                    new Balance();
                },
                styles: [
                    'layout.css',
                    'index.css',
                    'adaptive.css',
                ],
            },
        ]
    }

    private initEvents(): void {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
    }

    private parseHash(): {routeWithHash: string, params: Record<string, string> | null} {
        const hash: string = window.location.hash; // Получаем hash из адресной строки
        const [routeWithHash, queryString]: [string, string | undefined] = hash.split('?') as [string, string | undefined]; // Разделяем на маршрут и параметры

        const params: Record<string, string> | null = queryString ? Object.fromEntries(new URLSearchParams(queryString).entries()) : null; // Если параметры есть, создаем объект URLSearchParams

        return {
            routeWithHash, // Маршрут с символом #
            params         // Объект URLSearchParams для извлечения параметров
        };
    }

    private async activateRoute(): Promise<void> {
        const { routeWithHash } = this.parseHash(); // Получаем текущий маршрут
        const previousRoute: string = this.currentRoute; // Сохраняем предыдущий маршрут
        this.currentRoute = routeWithHash; // Обновляем текущий маршрут
        // Находим объект маршрута для предыдущего
        const previousRouteObject: RouteType | undefined = this.routes.find(route => route.route === previousRoute);
        if (previousRouteObject) {
            if (previousRouteObject.styles && previousRouteObject.styles.length > 0) {
                // находим и удаляем старые стили
                previousRouteObject.styles.forEach((style: string): void => {
                    const linkElement: HTMLElement | null = document.querySelector(`link[href='/styles/${style}']`);
                    if (linkElement) {
                        linkElement.remove();
                    }
                });
            }
        }

        const newRoute: RouteType | undefined = this.routes.find((item: RouteType): boolean => {
            // const {routeWithHash}: string = this.parseHash(); //получаем маршрут без параметров
            return item.route === routeWithHash;
        });

        if (newRoute) {
            if (newRoute.title && this.titlePageElement) {
                this.titlePageElement.innerText = newRoute.title;
            }

            if (newRoute.styles && newRoute.styles.length > 0) {
                newRoute.styles.forEach((style: string): void => {
                    const link: HTMLLinkElement = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = `/styles/${style}`;
                    document.head.appendChild(link);
                });
            }

            if (newRoute.template) {
                let contentBlock: HTMLElement | null = this.contentPageElement;
                if (this.contentPageElement) {
                    this.contentPageElement.classList.remove('content-center-auth');
                }

                if (newRoute.useLayout) {
                    if (this.contentPageElement) {
                        this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    }

                    contentBlock = document.getElementById('content-layout');
                    const profileUserElement: HTMLElement | null = document.getElementById('profile-user');
                    const userInfo: UserInfoType | null = AuthUtils.getUserInfo();

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
                    const userIconElement: HTMLElement | null = document.getElementById("user-icon");
                    this.dropdownMenuElement = document.getElementById("dropdown-menu");
                    if (userIconElement) {
                        userIconElement.addEventListener('click', this.showLogout.bind(this));
                    }
                    if (this.burgerElement) {
                        this.burgerElement.addEventListener('click', this.showSidebar.bind(this));
                    }

                    this.activateMenuItem(newRoute);
                } else {
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
        } else {
            location.href = '#/login';
            console.log('No route found');
        }
    }

    private activateMenuItem(route: RouteType): void {
        document.querySelectorAll('.nav-link').forEach(link => {
            const href: string | null = link.getAttribute('href');
            if (href) {
                if ((route.route.includes(href) && href !== '#/') || (route.route === "#/" && href === '#/')) {
                    link.classList.add('active');
                } else {
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
                } else {
                    this.toggleElement.classList.remove('active');
                    this.activeBlockElement.classList.remove('active-block');
                    this.toggleElement.classList.add('collapsed');
                    this.listElement.classList.remove('show');
                    this.collapsedSvgElement.classList.remove('collapsed');
                }
            }
        });
    }

    private showSidebar(): void {
        if (this.sidebarElement && this.burgerElement) {
            this.sidebarElement.classList.toggle("d-none");
            this.sidebarElement.classList.toggle("d-flex");
            this.sidebarElement.classList.toggle("sidebar-background");
            this.burgerElement.classList.toggle("burger-margin");
        }
    }

    private showLogout(): void {
        if (this.dropdownMenuElement) {
            this.dropdownMenuElement.classList.toggle('show');
        }
    }
}