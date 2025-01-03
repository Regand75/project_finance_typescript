import {ModalManager} from "../modal.js";
import {OperationsService} from "../../services/operations-service.js";

export class Expenses {
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

    async getExpenses(params) {
        try {
            const expensesResult = await OperationsService.getCategories(`/${params}`);
            if (expensesResult && expensesResult.length > 0) {
                this.showExpenses(expensesResult);
            } else if (expensesResult.error) {
                console.log(expensesResult.error);
                location.href = '#/operations';
            }
        } catch (error) {
            console.log(error);
        }
    }

    async deleteCategoryExpense() {
        this.params = JSON.parse(this.modalOverlay.dataset.params); // получаем id и название категории, которую надо удалить
        try {
            const operationsResult = await OperationsService.getOperations(`?period=all`); // получаем все операции для последующего удаления совпадающих с удаляемой категорией
            if (operationsResult) {
                const operationsToDeleteResult = operationsResult.filter(item => item.category === this.params.category); // находим все записи, связанные с удаляемой категорией
                if (operationsToDeleteResult) {
                    const deleteCategoryResult = await OperationsService.deleteCategory(`/expense/${this.params.id}`); // удаляем категорию
                    if (deleteCategoryResult) {
                        for (const item of operationsToDeleteResult) {
                            try {
                                const deleteOperationResult = await OperationsService.deleteOperation(`/${item.id}`); // удаляем записи, связанные с удаленной категорией
                                if (deleteOperationResult) {
                                    this.flagDelete = true;
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        }
                        ModalManager.hideModal();
                        location.href = '#/expenses';
                        console.log('DELETE CATEGORY');
                    } else if (deleteCategoryResult.error) {
                        console.log(deleteCategoryResult.error);
                        location.href = '#/operations';
                    }
                }
            } else if (operationsResult.error) {
                console.log(operationsResult.error);
                location.href = '#/';
            }
        } catch (error) {
            console.log(error);
        }
    }

    showExpenses(expenses) {
        const expensesContainerElement = document.getElementById("expenses-container");
        const blockAddingElement = document.getElementById("block-adding");
        expensesContainerElement.innerHTML = '';
        expensesContainerElement.appendChild(blockAddingElement);
        expenses.forEach((expense) => {
            const div = this.createExpenseBlock(expense.id, expense.title);
            expensesContainerElement.insertBefore(div, blockAddingElement);
        });
    }

    createExpenseBlock(id, title, editHref = '#/expense/edit') {
        // Создаем основной контейнер
        const block = document.createElement('div');
        block.className = 'expense-block border bg-border-custom rounded';
        block.setAttribute('data-id', id);

        // Создаем заголовок блока
        const titleDiv = document.createElement('div');
        titleDiv.className = 'expense-title';

        const titleText = document.createElement('h3');
        titleText.className = 'expense-title-text';
        titleText.textContent = title;

        titleDiv.appendChild(titleText);

        // Создаем контейнер для кнопок
        const activeDiv = document.createElement('div');
        activeDiv.className = 'expense-active d-flex';

        // Кнопка "Редактировать"
        const editButton = document.createElement('a');
        editButton.href = `${editHref}?id=${id}`;
        editButton.className = 'expense-edit btn btn-primary btn-custom';
        editButton.textContent = 'Редактировать';

        // Кнопка "Удалить"
        const deleteButton = document.createElement('button');
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