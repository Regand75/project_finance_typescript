"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Incomes = void 0;
const modal_1 = require("../modal");
const operations_service_1 = require("../../services/operations-service");
class Incomes {
    constructor() {
        this.buttonNoDeleteElement = document.getElementById("no-delete");
        this.buttonDeleteElement = document.getElementById("modal-delete");
        if (this.buttonNoDeleteElement) {
            this.buttonNoDeleteElement.addEventListener('click', modal_1.ModalManager.hideModal);
        }
        if (this.buttonDeleteElement) {
            this.buttonDeleteElement.addEventListener('click', this.deleteCategoryIncome.bind(this));
        }
        this.getIncomes('income').then();
        this.modalOverlay = document.getElementById("modal-overlay");
        this.params = null;
    }
    async getIncomes(params) {
        try {
            const incomesResult = await operations_service_1.OperationsService.getCategories(`/${params}`);
            if (incomesResult && incomesResult.length > 0) {
                this.showIncomes(incomesResult);
            }
            else {
                location.href = '#/operations';
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async deleteCategoryIncome() {
        if (this.modalOverlay && this.modalOverlay.dataset.params) {
            this.params = JSON.parse(this.modalOverlay.dataset.params); // получаем id и название категории, которую надо удалить
        }
        try {
            const operationsResult = await operations_service_1.OperationsService.getOperations(`?period=all`); // получаем все операции для последующего удаления совпадающих с удаляемой категорией
            if (operationsResult) {
                if (this.params && 'category' in this.params && 'id' in this.params) {
                    const operationsToDeleteResult = operationsResult.filter((item) => item.category === this.params.category); // находим все записи, связанные с удаляемой категорией
                    if (operationsToDeleteResult) {
                        const deleteCategoryResult = await operations_service_1.OperationsService.deleteCategory(`/income/${this.params.id}`); // удаляем категорию
                        if (deleteCategoryResult) {
                            for (const item of operationsToDeleteResult) {
                                try {
                                    await operations_service_1.OperationsService.deleteOperation(`/${item.id}`); // удаляем записи, связанные с удаленной категорией
                                }
                                catch (error) {
                                    console.log(error);
                                }
                            }
                            modal_1.ModalManager.hideModal();
                            location.href = '#/incomes';
                            console.log('DELETE CATEGORY');
                        }
                        else {
                            location.href = '#/operations';
                        }
                    }
                }
            }
            else {
                location.href = '#/';
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    showIncomes(incomes) {
        const incomesContainerElement = document.getElementById("incomes-container");
        const blockAddingElement = document.getElementById("block-adding");
        if (incomesContainerElement && blockAddingElement) {
            incomesContainerElement.innerHTML = '';
            incomesContainerElement.appendChild(blockAddingElement);
            incomes.forEach((income) => {
                const div = this.createIncomeBlock(income.id.toString(), income.title);
                incomesContainerElement.insertBefore(div, blockAddingElement);
            });
        }
    }
    createIncomeBlock(id, title, editHref = '#/income/edit') {
        // Создаем основной контейнер
        const block = document.createElement('div');
        block.className = 'income-block border bg-border-custom rounded';
        block.setAttribute('data-id', id);
        // Создаем заголовок блока
        const titleDiv = document.createElement('div');
        titleDiv.className = 'income-title';
        const titleText = document.createElement('h3');
        titleText.className = 'income-title-text';
        titleText.textContent = title;
        titleDiv.appendChild(titleText);
        // Создаем контейнер для кнопок
        const activeDiv = document.createElement('div');
        activeDiv.className = 'income-active d-flex';
        // Кнопка "Редактировать"
        const editButton = document.createElement('a');
        editButton.href = `${editHref}?id=${id}`;
        editButton.className = 'income-edit btn btn-primary btn-custom';
        editButton.textContent = 'Редактировать';
        // Кнопка "Удалить"
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'income-delete btn btn-danger btn-custom';
        deleteButton.textContent = 'Удалить';
        deleteButton.addEventListener('click', () => modal_1.ModalManager.showModal(id, title));
        // Добавляем кнопки в контейнер
        activeDiv.appendChild(editButton);
        activeDiv.appendChild(deleteButton);
        // Добавляем заголовок и контейнер кнопок в основной блок
        block.appendChild(titleDiv);
        block.appendChild(activeDiv);
        return block;
    }
}
exports.Incomes = Incomes;
