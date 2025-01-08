"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationCreating = void 0;
const operations_service_1 = require("../../services/operations-service");
const common_utils_1 = require("../../utils/common-utils");
const filter_utils_1 = require("../../utils/filter-utils");
class OperationCreating {
    constructor(parseHash) {
        this.fields = [];
        const { params } = parseHash();
        this.params = params;
        this.typeElement = document.getElementById('typeSelect');
        this.categoryElement = document.getElementById('categorySelect');
        this.operationCreatingButton = document.getElementById('operation-creating');
        if (this.operationCreatingButton) {
            this.operationCreatingButton.addEventListener('click', this.saveOperation.bind(this));
        }
        common_utils_1.CommonUtils.initBackButton();
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
        filter_utils_1.FilterUtils.initializeDatepickers();
        this.fields.forEach((item) => {
            item.element = document.getElementById(item.id);
            if (item.element) {
                item.element.onchange = () => {
                    this.validateField(item, item.element);
                };
            }
        });
        if (this.params && 'category' in this.params) {
            this.getCategories(this.params.category).then();
        }
    }
    async getCategories(categoryType) {
        try {
            const categoriesResult = await operations_service_1.OperationsService.getCategories(`/${categoryType}`);
            if (categoriesResult && categoriesResult.length > 0) {
                this.showTypeSelects();
                this.showCategorySelect(categoriesResult);
            }
            else {
                location.href = '#/operations';
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async changeCategorySelect() {
        try {
            const categoriesResult = await operations_service_1.OperationsService.getCategories(`/${this.typeElement.value}`);
            if (categoriesResult && categoriesResult.length > 0) {
                this.showCategorySelect(categoriesResult);
            }
            else {
                location.href = '#/operations';
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    showTypeSelects() {
        if (this.params && 'category' in this.params) {
            for (let i = 0; i < this.typeElement.options.length; i++) {
                if (this.typeElement.options[i].value === this.params.category) {
                    this.typeElement.options[i].selected = true;
                }
            }
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
        const validForm = this.fields.every(item => item.valid);
        if (this.operationCreatingButton) {
            if (validForm) {
                this.operationCreatingButton.removeAttribute('disabled');
            }
            else {
                this.operationCreatingButton.setAttribute('disabled', 'disabled');
            }
        }
        return validForm;
    }
    ;
    async saveOperation(e) {
        e.preventDefault();
        if (this.validateForm()) {
            let type = '';
            let amount = null;
            let date = '';
            let comment = '';
            let categoryId = null;
            if (this.typeElement) {
                type = this.typeElement.value;
            }
            const amountField = this.fields.find((item) => item.name === 'amount');
            if (amountField && amountField.element) {
                amount = parseInt(amountField.element.value);
            }
            const dateField = this.fields.find((item) => item.name === 'date');
            if (dateField && dateField.element) {
                date = common_utils_1.CommonUtils.convertDate(dateField.element.value);
            }
            const commentField = document.getElementById('comment');
            if (commentField) {
                comment = commentField.value;
            }
            const categoryIdField = this.categoryElement.value;
            if (this.categoryElement) {
                categoryId = parseInt(categoryIdField);
            }
            try {
                const operationResult = await operations_service_1.OperationsService.createOperation({
                    type: type,
                    amount: amount,
                    date: date,
                    comment: comment,
                    category_id: categoryId,
                });
                if (operationResult) {
                    location.href = '#/operations';
                }
                else {
                    location.href = `#/${type}s`;
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }
}
exports.OperationCreating = OperationCreating;
