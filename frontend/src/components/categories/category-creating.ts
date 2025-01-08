import {OperationsService} from "../../services/operations-service";
import {UrlUtils as urlUtils} from "../../utils/url-utils";
import {CommonUtils} from "../../utils/common-utils";
import {CategoryResponseType} from "../../types/categories-response.type";

export class CategoryCreating {
    readonly titleNewCategoryInput: HTMLElement | null;
    private creatingCategoryElement: HTMLElement | null;
    readonly category: string | undefined;

    constructor() {
        this.titleNewCategoryInput = document.getElementById('title-new-category');
        CommonUtils.initBackButton();
        this.creatingCategoryElement = document.getElementById('creating-category');
        if (this.titleNewCategoryInput) {
            this.titleNewCategoryInput.addEventListener('input', this.activeButton.bind(this));
        }
        if (this.creatingCategoryElement) {
            this.creatingCategoryElement.addEventListener('click', this.creatingCategory.bind(this));
        }
        if (this.category) {
            this.category = urlUtils.getUrlHashPart();
        }
    }

    private activeButton(): void {
        if (this.creatingCategoryElement) {
            if ((this.titleNewCategoryInput as HTMLSelectElement).value !== '') {
                this.creatingCategoryElement.classList.remove('disabled');
            } else {
                this.creatingCategoryElement.classList.add('disabled');
            }
        }
    };

    private async creatingCategory(): Promise<void> {
        let partUrl: string = ''
        if (this.category === 'income') {
            partUrl = '/income';
        } else if (this.category === 'expense') {
            partUrl = '/expense';
        }

        try {
            const operationsResult: CategoryResponseType = await OperationsService.createCategory(partUrl, {
                title: (this.titleNewCategoryInput as HTMLSelectElement).value,
            });
            if (operationsResult) {
                location.href = `#/${this.category}s`;
            } else {
                location.href = '#/operations';
            }

        } catch (error) {
            console.log(error);
        }
    }
}