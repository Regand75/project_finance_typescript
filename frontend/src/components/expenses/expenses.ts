import {ModalManager} from "../modal";
import {OperationsService} from "../../services/operations-service";
import {
    CategoriesResponseType,
    CategoryErrorResponse,
    CategorySuccessResponse
} from "../../types/categories-response.type";
import {OperationsResponseType, OperationsSuccessResponse} from "../../types/operations-response.type";
import {ParamsType} from "../../types/params.type";

export class Expenses {
    readonly buttonNoDeleteElement: HTMLElement | null;
    readonly buttonDeleteElement: HTMLElement | null;
    readonly modalOverlay: HTMLElement | null;
    private params: ParamsType | null;

    constructor() {
        this.buttonNoDeleteElement = document.getElementById("no-delete");
        this.buttonDeleteElement = document.getElementById("modal-delete");

        if (this.buttonNoDeleteElement) {
            this.buttonNoDeleteElement.addEventListener('click', ModalManager.hideModal);
        }

        if (this.buttonDeleteElement) {
            this.buttonDeleteElement.addEventListener('click', this.deleteCategoryExpense.bind(this));
        }

        this.getExpenses('expense').then();
        this.modalOverlay = document.getElementById("modal-overlay");
        this.params = null;
    }

    private async getExpenses(params: string): Promise<void> {
        try {
            const expensesResult: CategoriesResponseType = await OperationsService.getCategories(`/${params}`);
            if (expensesResult) {
                this.showExpenses(expensesResult as CategorySuccessResponse[]);
            } else {
                location.href = '#/operations';
            }
        } catch (error) {
            console.log(error);
        }
    }

    private async deleteCategoryExpense(): Promise<void> {
        if (this.modalOverlay && this.modalOverlay.dataset.params) {
            this.params = JSON.parse(this.modalOverlay.dataset.params); // получаем id и название категории, которую надо удалить
        }
        try {
            const operationsResult: OperationsResponseType = await OperationsService.getOperations(`?period=all`); // получаем все операции для последующего удаления совпадающих с удаляемой категорией
            if (operationsResult) {
                const operationsToDeleteResult: OperationsSuccessResponse[] = (operationsResult as OperationsSuccessResponse[]).filter((item: OperationsSuccessResponse): boolean => item.category === (this.params as ParamsType).category); // находим все записи, связанные с удаляемой категорией
                if (operationsToDeleteResult) {
                    const deleteCategoryResult: CategoryErrorResponse | false = await OperationsService.deleteCategory(`/expense/${(this.params as ParamsType).id}`); // удаляем категорию
                    if (deleteCategoryResult) {
                        for (const item of operationsToDeleteResult) {
                            try {
                                await OperationsService.deleteOperation(`/${item.id}`); // удаляем записи, связанные с удаленной категорией
                            } catch (error) {
                                console.log(error);
                            }
                        }
                        ModalManager.hideModal();
                        location.href = '#/expenses';
                        console.log('DELETE CATEGORY');
                    } else {
                        location.href = '#/operations';
                    }
                }
            } else {
                location.href = '#/';
            }
        } catch (error) {
            console.log(error);
        }
    }

    private showExpenses(expenses: CategorySuccessResponse[]): void {
        const expensesContainerElement: HTMLElement | null = document.getElementById("expenses-container");
        const blockAddingElement: HTMLElement | null = document.getElementById("block-adding");
        if (expensesContainerElement && blockAddingElement) {
            expensesContainerElement.innerHTML = '';
            expensesContainerElement.appendChild(blockAddingElement);
            expenses.forEach((expense: CategorySuccessResponse): void => {
                const div: HTMLElement = this.createExpenseBlock(expense.id.toString(), expense.title);
                expensesContainerElement.insertBefore(div, blockAddingElement);
            });
        }
    }

    createExpenseBlock(id: string, title: string, editHref: string = '#/expense/edit'): HTMLElement {
        // Создаем основной контейнер
        const block: HTMLElement = document.createElement('div');
        block.className = 'expense-block border bg-border-custom rounded';
        block.setAttribute('data-id', id);

        // Создаем заголовок блока
        const titleDiv: HTMLElement = document.createElement('div');
        titleDiv.className = 'expense-title';

        const titleText: HTMLElement = document.createElement('h3');
        titleText.className = 'expense-title-text';
        titleText.textContent = title;

        titleDiv.appendChild(titleText);

        // Создаем контейнер для кнопок
        const activeDiv: HTMLElement = document.createElement('div');
        activeDiv.className = 'expense-active d-flex';

        // Кнопка "Редактировать"
        const editButton: HTMLAnchorElement = document.createElement('a');
        editButton.href = `${editHref}?id=${id}`;
        editButton.className = 'expense-edit btn btn-primary btn-custom';
        editButton.textContent = 'Редактировать';

        // Кнопка "Удалить"
        const deleteButton: HTMLButtonElement = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'expense-delete btn btn-danger btn-custom';
        deleteButton.textContent = 'Удалить';
        deleteButton.addEventListener('click', () => ModalManager.showModal(id, title));

        // Добавляем кнопки в контейнер
        activeDiv.appendChild(editButton);
        activeDiv.appendChild(deleteButton);

        // Добавляем заголовок и контейнер кнопок в основной блок
        block.appendChild(titleDiv);
        block.appendChild(activeDiv);

        return block;
    }
}