"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryEdit = void 0;
const operations_service_1 = require("../../services/operations-service");
const url_utils_1 = require("../../utils/url-utils");
const common_utils_1 = require("../../utils/common-utils");
class CategoryEdit {
    constructor(parseHash) {
        this.categoryOriginalData = null;
        const { params } = parseHash();
        this.params = params;
        this.category = url_utils_1.UrlUtils.getUrlHashPart();
        this.categoryInput = document.getElementById("category-input");
        this.categorySaveElement = document.getElementById('category-save');
        if (this.categorySaveElement) {
            this.categorySaveElement.addEventListener('click', this.saveCategory.bind(this));
        }
        if (this.categoryInput) {
            this.categoryInput.addEventListener('input', this.activeButton.bind(this));
        }
        common_utils_1.CommonUtils.initBackButton();
        this.outputCategory().then();
    }
    async outputCategory() {
        if (this.params && 'id' in this.params) {
            try {
                const categoryResult = await operations_service_1.OperationsService.getCategory(`/${this.category}/${this.params.id}`);
                if (categoryResult && 'title' in categoryResult) {
                    this.categoryOriginalData = categoryResult.title;
                    this.categoryInput.value = categoryResult.title;
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
    activeButton() {
        if (this.categorySaveElement) {
            if (this.categoryInput.value !== '') {
                this.categorySaveElement.removeAttribute('disabled');
            }
            else {
                this.categorySaveElement.setAttribute('disabled', 'disabled');
            }
        }
    }
    async saveCategory() {
        if (this.categoryInput.value !== this.categoryOriginalData) {
            if (this.params && 'id' in this.params) {
                try {
                    const updateCategoryResult = await operations_service_1.OperationsService.updateCategory(`/${this.category}/${this.params.id}`, {
                        title: this.categoryInput.value,
                    });
                    if (updateCategoryResult) {
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
        else {
            location.href = `#/${this.category}s`;
        }
    }
}
exports.CategoryEdit = CategoryEdit;
