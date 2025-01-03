import {OperationsService} from "../../services/operations-service.js";
import {UrlUtils as urlUtils} from "../../utils/url-utils.js";
import {CommonUtils} from "../../utils/common-utils.js";

export class CategoryEdit {
    constructor(parseHash) {
        const { params } = parseHash();
        this.params = params;
        this.category = urlUtils.getUrlHashPart();
        this.categoryInput = document.getElementById("category-input");
        this.categorySaveElement = document.getElementById('category-save');

        this.categorySaveElement.addEventListener('click', this.saveCategory.bind(this));

        this.categoryInput.addEventListener('input', this.activeButton.bind(this));

        CommonUtils.initBackButton();

        this.outputCategory().then();
    }

    async outputCategory() {
        try {
            const categoryResult = await OperationsService.getCategory(`/${this.category}/${this.params.id}`);
            if (categoryResult) {
                this.categoryOriginalData = categoryResult.title;
                this.categoryInput.value = categoryResult.title;
            } else if (categoryResult.error) {
                console.log(categoryResult.error);
                location.href = '#/operations';
            }
        } catch (error) {
            console.log(error);
        }
    }

    activeButton() {
        if (this.categoryInput.value !== '') {
            this.categorySaveElement.removeAttribute('disabled');
        } else {
            this.categorySaveElement.setAttribute('disabled', 'disabled');
        }
    }

    async saveCategory() {
        if (this.categoryInput.value !== this.categoryOriginalData) {
            try {
                const updateCategoryResult = await OperationsService.updateCategory(`/${this.category}/${this.params.id}`, {
                    title: this.categoryInput.value,
                });
                if (updateCategoryResult) {
                    location.href = `#/${this.category}s`;
                } else if (updateCategoryResult.error) {
                    console.log(updateCategoryResult.error);
                    location.href = '#/operations';
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            location.href = `#/${this.category}s`;
        }
    }
}