import {OperationsService} from "../../services/operations-service";
import {UrlUtils as urlUtils} from "../../utils/url-utils";
import {CommonUtils} from "../../utils/common-utils";
import {CategoryResponseType} from "../../types/categories-response.type";

export class CategoryEdit {
    readonly params: Record<string, string> | null;
    readonly category: string | undefined;
    readonly categoryInput: HTMLElement | null;
    readonly categorySaveElement: HTMLElement | null;
    private categoryOriginalData: string | null = null;

    constructor(parseHash: () => { routeWithHash: string; params: Record<string, string> | null }) {
        const {params} = parseHash();
        this.params = params;
        this.category = urlUtils.getUrlHashPart();
        this.categoryInput = document.getElementById("category-input");
        this.categorySaveElement = document.getElementById('category-save');

        if (this.categorySaveElement) {
            this.categorySaveElement.addEventListener('click', this.saveCategory.bind(this));
        }

        if (this.categoryInput) {
            this.categoryInput.addEventListener('input', this.activeButton.bind(this));
        }

        CommonUtils.initBackButton();

        this.outputCategory().then();
    }

    private async outputCategory(): Promise<void> {
        if (this.params && 'id' in this.params) {
            try {
                const categoryResult: CategoryResponseType = await OperationsService.getCategory(`/${this.category}/${this.params.id}`);
                if (categoryResult && 'title' in categoryResult) {
                    this.categoryOriginalData = categoryResult.title;
                    (this.categoryInput as HTMLInputElement).value = categoryResult.title;
                } else {
                    location.href = '#/operations';
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    private activeButton(): void {
        if (this.categorySaveElement) {
            if ((this.categoryInput as HTMLInputElement).value !== '') {
                this.categorySaveElement.removeAttribute('disabled');
            } else {
                this.categorySaveElement.setAttribute('disabled', 'disabled');
            }
        }
    }

    private async saveCategory(): Promise<void> {
        if ((this.categoryInput as HTMLInputElement).value !== this.categoryOriginalData) {
            if (this.params && 'id' in this.params) {
                try {
                    const updateCategoryResult: CategoryResponseType = await OperationsService.updateCategory(`/${this.category}/${this.params.id}`, {
                        title: (this.categoryInput as HTMLInputElement).value,
                    });
                    if (updateCategoryResult) {
                        location.href = `#/${this.category}s`;
                    } else {
                        location.href = '#/operations';
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        } else {
            location.href = `#/${this.category}s`;
        }
    }
}