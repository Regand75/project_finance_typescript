import {OperationsService} from "../../services/operations-service";
import {CommonUtils} from "../../utils/common-utils";
import {FilterUtils} from "../../utils/filter-utils";
import {OperationRequest, OperationResponseType, OperationsSuccessResponse} from "../../types/operations-response.type";
import {FormFieldType} from "../../types/form-field.type";
import {CategoriesResponseType, CategorySuccessResponse} from "../../types/categories-response.type";

export class OperationEdit {
    readonly params: Record<string, string> | null;
    private operationOriginalData: OperationsSuccessResponse | null;
    readonly typeElement: HTMLSelectElement | null;
    readonly categoryElement: HTMLSelectElement | null;
    readonly operationEditButton: HTMLElement | null;
    private fields: FormFieldType[] = [];
    private typeField: 'expense' | 'income';

    constructor(parseHash: () => { routeWithHash: string; params: Record<string, string> | null }) {
        const {params}: Record<string, string> | null = parseHash();
        this.params = params;
        this.operationOriginalData = null;
        this.typeElement = document.getElementById('typeSelect') as HTMLSelectElement;
        this.categoryElement = document.getElementById('categorySelect') as HTMLSelectElement;
        this.operationEditButton = document.getElementById('operation-edit');
        if (this.operationEditButton) {
            this.operationEditButton.addEventListener('click', this.saveOperation.bind(this));
        }

        CommonUtils.initBackButton();

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
                valid: false,
            },
        ];

        // Инициализация datepicker
        FilterUtils.initializeDatepickers();

        if (this.params && 'id' in this.params) {
            this.getOperation(this.params.id).then();
        }

        this.fields.forEach((item: FormFieldType): void => {
            item.element = document.getElementById(item.id) as HTMLInputElement;
            item.element.onchange = () => {
                this.validateField(item, item.element);
            }
        });
    }

    private async getOperation(id: string): Promise<void> {
        try {
            const operationResult: OperationResponseType = await OperationsService.getOperation(`/${id}`);
            if (operationResult) {
                this.operationOriginalData = operationResult as OperationsSuccessResponse; // сохраняем данные для дальнейшего отслеживания изменений
                if (this.typeElement && 'type' in operationResult) {
                    for (let i: number = 0; i < this.typeElement.options.length; i++) {
                        if (this.typeElement.options[i].value === operationResult.type) {
                            this.typeElement.options[i].selected = true;
                        }
                    }
                    this.typeElement.disabled = true;
                    this.getCategories(operationResult.type);
                }
                if (this.categoryElement) {
                    this.categoryElement.disabled = true;
                }

                this.fields.forEach((field: FormFieldType): void => {
                    const inputElement: HTMLElement | null = document.getElementById(field.id);
                    if (inputElement) {
                        field.element = inputElement as HTMLInputElement;
                        if (field.name === 'date' && operationResult[field.name]) {
                            // Преобразуем дату в формат день.месяц.год
                            if ('date' in operationResult) {
                                const dateConvert: Date = new Date(operationResult.date); // Преобразуем строку в объект Date
                                (inputElement as HTMLInputElement).value = new Intl.DateTimeFormat('ru-RU').format((dateConvert));
                            }
                        } else {
                            (inputElement as HTMLInputElement).value = operationResult[field.name];
                        }
                    }
                });
                this.fields.forEach((field: FormFieldType): void => {
                    this.validateField(field, field.element);
                });
            } else {
                // Ошибка
                location.href = '#/operations';
                return;
            }
        } catch (error) {
            console.log(error);
        }
    }

    private async getCategories(type: string): Promise<void> {
        try {
            const categoriesResult: CategoriesResponseType = await OperationsService.getCategories(`/${type}`);
            if (categoriesResult) {
                if ((categoriesResult as CategorySuccessResponse[]).length > 0) {
                    this.showCategorySelect(categoriesResult);
                }
            } else {
                location.href = '#/operations';
            }
        } catch (error) {
            console.log(error);
        }
    }

    private showCategorySelect(categoryList: CategoriesResponseType): void {
        if (this.categoryElement) {
            this.categoryElement.innerHTML = ''; // очищаем select
        }
        (categoryList as CategorySuccessResponse[]).forEach((item: CategorySuccessResponse): void => {
            const option: HTMLOptionElement = document.createElement("option");
            option.value = item.id.toString();
            option.innerText = item.title;
            if (this.operationOriginalData) {
                if (option.innerText === this.operationOriginalData.category) {
                    option.selected = true;
                }
            }
            if (this.categoryElement) {
                this.categoryElement.appendChild(option);
            }
        });
    }

    validateField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            element.classList.add('is-invalid');
            field.valid = false;
        } else {
            element.classList.remove('is-invalid');
            field.valid = true;
        }
        this.validateForm();
    }

    private validateForm(): boolean {
        const validForm: boolean = this.fields.every((item: FormFieldType) => item.valid);
        if (this.operationEditButton) {
            if (validForm) {
                this.operationEditButton.removeAttribute('disabled');
            } else {
                this.operationEditButton.setAttribute('disabled', 'disabled');
            }
        }
        return validForm;
    };

    private async saveOperation(e: Event): Promise<void> {
        e.preventDefault();

        if (this.validateForm()) {
            if (this.typeElement && (this.typeElement.value === 'expense' || this.typeElement.value === 'income')) {
                this.typeField = this.typeElement.value;
            }
            const amountField: FormFieldType = this.fields.find((item: FormFieldType): boolean => item.name === 'amount');
            if (!amountField || !amountField.element) {
                return;
            }
            const dateField: FormFieldType = this.fields.find((item: FormFieldType): boolean => item.name === 'date');
            if (!dateField || !dateField.element) {
                return;
            }
            const commentField: HTMLElement = document.getElementById('comment');
            if (!commentField) {
                return;
            }
            if (!this.categoryElement) {
                return;
            }
            const operationData: OperationRequest = {
                type: this.typeField,
                amount: parseInt(amountField.element.value, 10),
                date: CommonUtils.convertDate(dateField.element.value),
                comment: (commentField as HTMLInputElement).value,
                category_id: parseInt(this.categoryElement.value, 10)
            };
                // Проверяем наличие хотя бы одного различия
            const changedData: boolean = Object.keys(operationData).some((key: string) =>
                this.operationOriginalData &&
                typeof this.operationOriginalData === 'object' &&
                Object.prototype.hasOwnProperty.call(this.operationOriginalData, key) &&
                operationData[key] !== this.operationOriginalData[key]
            );
            if (changedData && 'id' in this.params) {
                try {
                    const operationResult: OperationResponseType = await OperationsService.updateOperation(`/${this.params.id}`, operationData);
                    if (operationResult) {
                        location.href = '#/operations';
                    } else {
                        location.href = '#/';
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                location.href = '#/operations';
            }
        }
    }
}