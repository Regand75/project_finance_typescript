"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryCreating = void 0;
const operations_service_1 = require("../../services/operations-service");
const url_utils_1 = require("../../utils/url-utils");
const common_utils_1 = require("../../utils/common-utils");
class CategoryCreating {
    constructor() {
        this.titleNewCategoryInput = document.getElementById('title-new-category');
        common_utils_1.CommonUtils.initBackButton();
        this.creatingCategoryElement = document.getElementById('creating-category');
        if (this.titleNewCategoryInput) {
            this.titleNewCategoryInput.addEventListener('input', this.activeButton.bind(this));
        }
        if (this.creatingCategoryElement) {
            this.creatingCategoryElement.addEventListener('click', this.creatingCategory.bind(this));
        }
        if (this.category) {
            this.category = url_utils_1.UrlUtils.getUrlHashPart();
        }
    }
    activeButton() {
        if (this.creatingCategoryElement) {
            if (this.titleNewCategoryInput.value !== '') {
                this.creatingCategoryElement.classList.remove('disabled');
            }
            else {
                this.creatingCategoryElement.classList.add('disabled');
            }
        }
    }
    ;
    async creatingCategory() {
        let partUrl = '';
        if (this.category === 'income') {
            partUrl = '/income';
        }
        else if (this.category === 'expense') {
            partUrl = '/expense';
        }
        try {
            const operationsResult = await operations_service_1.OperationsService.createCategory(partUrl, {
                title: this.titleNewCategoryInput.value,
            });
            if (operationsResult) {
                location.href = `#/${this.category}s`;
            }
            else {
                location.href = '#/operations';
            }
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.CategoryCreating = CategoryCreating;
