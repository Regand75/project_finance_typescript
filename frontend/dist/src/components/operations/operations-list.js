"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationsList = void 0;
const operations_service_1 = require("../../services/operations-service");
const filter_utils_1 = require("../../utils/filter-utils");
const common_utils_1 = require("../../utils/common-utils");
class OperationsList {
    constructor(parseHash) {
        const { params } = parseHash();
        this.params = params;
        this.recordsElement = document.getElementById('records');
        this.filtersContainer = document.getElementById('filters-container'); // Родительский контейнер кнопок фильтра
        if (this.filtersContainer) {
            this.filtersContainer.addEventListener('click', event => filter_utils_1.FilterUtils.handleFilterClick(event, this.showRecords.bind(this)));
        }
        this.creatingIncomeElement = document.getElementById('creating-income');
        if (this.creatingIncomeElement) {
            this.creatingIncomeElement.addEventListener('click', () => {
                location.href = '#/operations/creating?category=income';
            });
        }
        this.creatingExpenseElement = document.getElementById('creating-expense');
        if (this.creatingExpenseElement) {
            this.creatingExpenseElement.addEventListener('click', () => {
                location.href = '#/operations/creating?category=expense';
            });
        }
        this.getOperations('today').then();
        // Инициализация datepicker
        filter_utils_1.FilterUtils.initializeDatepickers();
    }
    async getOperations(period) {
        try {
            const operationsResult = await operations_service_1.OperationsService.getOperations(`?period=${period}`);
            if (operationsResult && operationsResult.length > 0) {
                this.showRecords(operationsResult);
            }
            else {
                location.href = '#/';
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    showRecords(operations) {
        const recordsElement = this.recordsElement;
        if (recordsElement) {
            recordsElement.innerHTML = ''; // Очистим таблицу перед добавлением новых записей
        }
        // заполняем таблицу данными об операциях
        operations.forEach((operation, index) => {
            const row = this.createRow(operation, index + 1);
            if (recordsElement && row) {
                recordsElement.appendChild(row);
            }
        });
    }
    // Создание строки таблицы
    createRow(operation, orderNumber) {
        const tr = document.createElement('tr');
        // Заменяем тип операции на русский язык и задаем цвет текста
        const operationType = operation.type === 'income' ? 'доход' : 'расход';
        const textClass = operation.type === 'income' ? 'text-success' : 'text-danger';
        // Преобразуем дату в формат день.месяц.год
        const date = new Date(operation.date); // Преобразуем строку в объект Date
        const formattedDate = new Intl.DateTimeFormat('ru-RU').format(date);
        // Форматируем сумму с разделением тысяч пробелом
        const formattedAmount = Number(operation.amount).toLocaleString('ru-RU');
        tr.setAttribute('data-id', operation.id.toString());
        tr.innerHTML = `
        <th scope="row">${orderNumber}</th>
        <td class="${textClass}">${operationType}</td>
        <td>${operation.category}</td>
        <td>${formattedAmount} $</td>
        <td>${formattedDate}</td>
        <td>${operation.comment}</td>
        <td class="text-nowrap">
            ${common_utils_1.CommonUtils.generateGridToolsColumn('operations', operation.id)}
        </td>
    `;
        return tr;
    }
}
exports.OperationsList = OperationsList;
