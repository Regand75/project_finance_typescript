import {OperationsService} from "../../services/operations-service.js";
import {UrlUtils as urlUtils} from "../../utils/url-utils.js";
import {CommonUtils} from "../../utils/common-utils.js";

export class CategoryCreating {
    constructor() {
        this.titleNewCategoryInput = document.getElementById('title-new-category');
        CommonUtils.initBackButton();
        this.creatingCategoryElement = document.getElementById('creating-category');
        this.titleNewCategoryInput.addEventListener('input', this.activeButton.bind(this));
        this.creatingCategoryElement.addEventListener('click', this.creatingCategory.bind(this));
        this.category = urlUtils.getUrlHashPart();
    }

    activeButton() {
        if (this.titleNewCategoryInput.value !== '') {
            this.creatingCategoryElement.classList.remove('disabled');
        } else {
            this.creatingCategoryElement.classList.add('disabled');
        }
    };

    async creatingCategory() {
        let partUrl = ''
        if (this.category === 'income') {
            partUrl = '/income';
        } else if (this.category === 'expense') {
            partUrl = '/expense';
        }

        try {
            const operationsResult = await OperationsService.createCategory(partUrl, {
                title: this.titleNewCategoryInput.value,
            });
            if (operationsResult) {
                location.href = `#/${this.category}s`;
            } else if (operationsResult.error) {
                console.log(operationsResult.error);
                location.href = '#/operations';
            }

        } catch (error) {
            console.log(error);
        }
    }
}