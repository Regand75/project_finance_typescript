import {OperationsService} from "../../services/operations-service";
import {CommonUtils} from "../../utils/common-utils";
import {FilterUtils} from "../../utils/filter-utils";
import {FormFieldType} from "../../types/form-field.type";
import {CategoriesResponseType, CategorySuccessResponse} from "../../types/categories-response.type";
import {OperationRequest, OperationResponseType} from "../../types/operations-response.type";

export class OperationCreating {
    readonly params: Record<string, string> | null;
    readonly typeElement: HTMLElement | null;
    readonly categoryElement: HTMLElement | null;
    readonly operationCreatingButton: HTMLElement | null;
    private fields: FormFieldType[] = [];

    constructor(parseHash: () => { routeWithHash: string; params: Record<string, string> | null }) {
        const { params } = parseHash();
        this.params = params;
        this.typeElement = document.getElementById('typeSelect');
        this.categoryElement = document.getElementById('categorySelect');
        this.operationCreatingButton = document.getElementById('operation-creating');
        if (this.operationCreatingButton) {
            this.operationCreatingButton.addEventListener('click', this.saveOperation.bind(this));
        }

        CommonUtils.initBackButton();

        if (this.typeElement) {
            this.typeElement.addEventListener('change', this.changeCategorySelect.bind(this));
        }

        this.fields = [
            {
                name: 'amount',
                id: 'amount',
                element: null,
                regex: /^\d*$/,
                valid: false,
            },
            {
                name: 'date',
                id: 'date',
                element: null,
                regex: /^([0-2]\d|3[01])\.(0\d|1[0-2])\.(\d{4})$/,
                valid: false,
            },
            {
                name: 'comment',
                id: 'comment',
                element: null,
                regex: /.*/,
                valid: false,
            },
        ];

        // Инициализация datepicker
        FilterUtils.initializeDatepickers();

        this.fields.forEach((item: FormFieldType): void => {
            item.element = document.getElementById(item.id) as HTMLInputElement;
            if (item.element) {
                item.element.onchange = () => {
                    this.validateField(item, item.element);
                }
            }
        });

        if (this.params && 'category' in this.params) {
            this.getCategories(this.params.category).then();
        }
    }

    private async getCategories(categoryType: string): Promise<void> {
        try {
            const categoriesResult: CategoriesResponseType = await OperationsService.getCategories(`/${categoryType}`);
            if (categoriesResult && (categoriesResult as CategorySuccessResponse[]).length > 0) {
                this.showTypeSelects();
                this.showCategorySelect(categoriesResult as CategorySuccessResponse[]);
            } else {
                location.href = '#/operations';
            }
        } catch (error) {
            console.log(error);
        }
    }

    private async changeCategorySelect(): Promise<void> {
        try {
            const categoriesResult: CategoriesResponseType = await OperationsService.getCategories(`/${(this.typeElement as HTMLSelectElement).value}`);
            if (categoriesResult && (categoriesResult as CategorySuccessResponse[]).length > 0) {
                this.showCategorySelect(categoriesResult as CategorySuccessResponse[]);
            } else {
                location.href = '#/operations';
            }
        } catch (error) {
            console.log(error);
        }
    }

    private showTypeSelects(): void {
        if (this.params && 'category' in this.params) {
            for (let i = 0; i < (this.typeElement as HTMLSelectElement).options.length; i++) {
                if ((this.typeElement as HTMLSelectElement).options[i].value === this.params.category) {
                    (this.typeElement as HTMLSelectElement).options[i].selected = true;
                }
            }
        }
    }

    private showCategorySelect(categoryList: CategorySuccessResponse[]): void {
        if (this.categoryElement) {
            this.categoryElement.innerHTML = ''; // очищаем select
        }
        categoryList.forEach((item: CategorySuccessResponse) => {
            const option:HTMLOptionElement = document.createElement("option");
            option.value = item.id.toString();
            option.innerText = item.title;
            if (this.categoryElement) {
                this.categoryElement.appendChild(option);
            }
        });
    }

    private validateField(field: FormFieldType, element: HTMLInputElement | null): void {
        if (element) {
            if (!element.value || !element.value.match(field.regex)) {
                element.classList.add('is-invalid');
                field.valid = false;
            } else {
                element.classList.remove('is-invalid');
                field.valid = true;
            }
        }
        this.validateForm();
    }

    private validateForm(): boolean {
        const validForm = this.fields.every(item => item.valid);
        if (this.operationCreatingButton) {
            if (validForm) {
                this.operationCreatingButton.removeAttribute('disabled');
            } else {
                this.operationCreatingButton.setAttribute('disabled', 'disabled');
            }
        }
        return validForm;
    };

    private async saveOperation(e: Event): Promise<void> {
        e.preventDefault();

        if (this.validateForm()) {
            let type: string = '';
            let amount: number | null = null;
            let date: string = '';
            let comment: string = '';
            let categoryId: number | null = null;
            if (this.typeElement) {
                type = (this.typeElement as HTMLSelectElement).value;
            }
            const amountField: FormFieldType | undefined = this.fields.find((item: FormFieldType): boolean => item.name === 'amount')
            if (amountField && amountField.element) {
                amount = parseInt(amountField.element.value);
            }
            const dateField: FormFieldType | undefined = this.fields.find((item: FormFieldType): boolean => item.name === 'date');
            if (dateField && dateField.element) {
                date = CommonUtils.convertDate(dateField.element.value);
            }
            const commentField: HTMLElement | null = document.getElementById('comment');
            if (commentField) {
                comment = (commentField as HTMLInputElement).value;
            }
            const categoryIdField: string = (this.categoryElement as HTMLInputElement).value;
            if (this.categoryElement) {
                categoryId = parseInt(categoryIdField);
            }
            try {
                const operationResult: OperationResponseType = await OperationsService.createOperation(({
                    type: type,
                    amount: amount,
                    date: date,
                    comment: comment,
                    category_id: categoryId,
                } as OperationRequest));
                if (operationResult) {
                    location.href = '#/operations';
                } else {
                    location.href = `#/${type}s`;
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
}