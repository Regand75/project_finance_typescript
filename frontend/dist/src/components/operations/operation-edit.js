"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationEdit = void 0;
const operations_service_1 = require("../../services/operations-service");
const common_utils_1 = require("../../utils/common-utils");
const filter_utils_1 = require("../../utils/filter-utils");
class OperationEdit {
    constructor(parseHash) {
        this.fields = [];
        this.typeField = 'income';
        const { params } = parseHash();
        this.params = params;
        this.operationOriginalData = null;
        this.typeElement = document.getElementById('typeSelect');
        this.categoryElement = document.getElementById('categorySelect');
        this.operationEditButton = document.getElementById('operation-edit');
        if (this.operationEditButton) {
            this.operationEditButton.addEventListener('click', this.saveOperation.bind(this));
        }
        common_utils_1.CommonUtils.initBackButton();
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
        filter_utils_1.FilterUtils.initializeDatepickers();
        if (this.params && 'id' in this.params) {
            this.getOperation(this.params.id).then();
        }
        this.fields.forEach((item) => {
            item.element = document.getElementById(item.id);
            if (item.element) {
                item.element.onchange = () => {
                    this.validateField(item, item.element);
                };
            }
        });
    }
    async getOperation(id) {
        try {
            const operationResult = await operations_service_1.OperationsService.getOperation(`/${id}`);
            if (operationResult) {
                this.operationOriginalData = operationResult; // сохраняем данные для дальнейшего отслеживания изменений
                if (this.typeElement && 'type' in operationResult) {
                    for (let i = 0; i < this.typeElement.options.length; i++) {
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
                this.fields.forEach((field) => {
                    const inputElement = document.getElementById(field.id);
                    if (inputElement) {
                        field.element = inputElement;
                        const key = field.name;
                        if (key === 'date' && operationResult[key]) {
                            // Преобразуем дату в формат день.месяц.год
                            if (operationResult && 'date' in operationResult) {
                                const dateConvert = new Date(operationResult.date); // Преобразуем строку в объект Date
                                inputElement.value = new Intl.DateTimeFormat('ru-RU').format((dateConvert));
                            }
                        }
                        else if (key in operationResult) {
                            inputElement.value = String(operationResult[key]);
                        }
                    }
                });
                this.fields.forEach((field) => {
                    this.validateField(field, field.element);
                });
            }
            else {
                // Ошибка
                location.href = '#/operations';
                return;
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async getCategories(type) {
        try {
            const categoriesResult = await operations_service_1.OperationsService.getCategories(`/${type}`);
            if (categoriesResult) {
                if (categoriesResult.length > 0) {
                    this.showCategorySelect(categoriesResult);
                }
            }
            else {
                location.href = '#/operations';
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    showCategorySelect(categoryList) {
        if (this.categoryElement) {
            this.categoryElement.innerHTML = ''; // очищаем select
        }
        categoryList.forEach((item) => {
            const option = document.createElement("option");
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
        if (element) {
            if (!element.value || !element.value.match(field.regex)) {
                element.classList.add('is-invalid');
                field.valid = false;
            }
            else {
                element.classList.remove('is-invalid');
                field.valid = true;
            }
        }
        this.validateForm();
    }
    validateForm() {
        const validForm = this.fields.every((item) => item.valid);
        if (this.operationEditButton) {
            if (validForm) {
                this.operationEditButton.removeAttribute('disabled');
            }
            else {
                this.operationEditButton.setAttribute('disabled', 'disabled');
            }
        }
        return validForm;
    }
    ;
    async saveOperation(e) {
        e.preventDefault();
        if (this.validateForm()) {
            if (this.typeElement && (this.typeElement.value === 'expense' || this.typeElement.value === 'income')) {
                this.typeField = this.typeElement.value;
            }
            const amountField = this.fields.find((item) => item.name === 'amount');
            if (!amountField || !amountField.element) {
                return;
            }
            const dateField = this.fields.find((item) => item.name === 'date');
            if (!dateField || !dateField.element) {
                return;
            }
            const commentField = document.getElementById('comment');
            if (!commentField) {
                return;
            }
            if (!this.categoryElement) {
                return;
            }
            const operationData = {
                type: this.typeField,
                amount: parseInt(amountField.element.value, 10),
                date: common_utils_1.CommonUtils.convertDate(dateField.element.value),
                comment: commentField.value,
                category_id: parseInt(this.categoryElement.value, 10)
            };
            // Проверяем наличие хотя бы одного различия
            const changedData = Object.keys(operationData).some((key) => {
                if (this.operationOriginalData &&
                    typeof this.operationOriginalData === 'object' &&
                    Object.prototype.hasOwnProperty.call(this.operationOriginalData, key) &&
                    Object.prototype.hasOwnProperty.call(operationData, key)) {
                    return operationData[key] !== this.operationOriginalData[key];
                }
                return false;
            });
            // const changedData: boolean = (Object.keys(operationData) as (keyof OperationsSuccessResponse)[]).some((key: keyof OperationsSuccessResponse) =>
            //     this.operationOriginalData &&
            //     typeof this.operationOriginalData === 'object' &&
            //     Object.prototype.hasOwnProperty.call(this.operationOriginalData, key) &&
            //     operationData[key] !== this.operationOriginalData[key]
            // );
            if (changedData && this.params && 'id' in this.params) {
                try {
                    const operationResult = await operations_service_1.OperationsService.updateOperation(`/${this.params.id}`, operationData);
                    if (operationResult) {
                        location.href = '#/operations';
                    }
                    else {
                        location.href = '#/';
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }
            else {
                location.href = '#/operations';
            }
        }
    }
}
exports.OperationEdit = OperationEdit;
