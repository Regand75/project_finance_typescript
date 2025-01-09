import {OperationsService} from "../../services/operations-service";
import {FilterUtils} from "../../utils/filter-utils";
import {CommonUtils} from "../../utils/common-utils";
import {OperationsResponseType, OperationsSuccessResponse} from "../../types/operations-response.type";

export class OperationsList {
    readonly params: Record<string, string> | null;
    readonly recordsElement: HTMLElement | null;
    readonly filtersContainer: HTMLElement | null;
    readonly creatingIncomeElement: HTMLElement | null;
    readonly creatingExpenseElement: HTMLElement | null;

    constructor(parseHash: () => { routeWithHash: string; params: Record<string, string> | null }) {
        const { params } = parseHash();
        this.params = params;

        this.recordsElement = document.getElementById('records');
        this.filtersContainer = document.getElementById('filters-container'); // Родительский контейнер кнопок фильтра

        if (this.filtersContainer) {
            this.filtersContainer.addEventListener('click', event =>
                FilterUtils.handleFilterClick(event, this.showRecords.bind(this))
            );
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
        FilterUtils.initializeDatepickers();
    }

    public async getOperations(period: string): Promise<void> {
        try {
            const operationsResult: OperationsResponseType = await OperationsService.getOperations(`?period=${period}`);
            if (operationsResult) {
                if ((operationsResult as OperationsSuccessResponse[]).length > 0) {
                    this.showRecords(operationsResult as OperationsSuccessResponse[]);
                }
            } else {
                location.href = '#/';
            }
        } catch (error) {
            console.log(error);
        }
    }

    private showRecords(operations: OperationsSuccessResponse[]): void {
        const recordsElement: HTMLElement | null = this.recordsElement;
        if (recordsElement) {
            recordsElement.innerHTML = ''; // Очистим таблицу перед добавлением новых записей
        }
        // заполняем таблицу данными об операциях
        operations.forEach((operation: OperationsSuccessResponse, index: number): void => {
            const row: HTMLTableRowElement = this.createRow(operation, index + 1);
            if (recordsElement && row) {
                recordsElement.appendChild(row);
            }
        });
    }

    // Создание строки таблицы
    private createRow(operation: OperationsSuccessResponse, orderNumber: number): HTMLTableRowElement {
        const tr: HTMLTableRowElement = document.createElement('tr');

        // Заменяем тип операции на русский язык и задаем цвет текста
        const operationType: string = operation.type === 'income' ? 'доход' : 'расход';
        const textClass: string = operation.type === 'income' ? 'text-success' : 'text-danger';

        // Преобразуем дату в формат день.месяц.год
        const date: Date = new Date(operation.date); // Преобразуем строку в объект Date
        const formattedDate: string = new Intl.DateTimeFormat('ru-RU').format(date);

        // Форматируем сумму с разделением тысяч пробелом
        const formattedAmount: string = Number(operation.amount).toLocaleString('ru-RU');

        tr.setAttribute('data-id', operation.id.toString());

        tr.innerHTML = `
        <th scope="row">${orderNumber}</th>
        <td class="${textClass}">${operationType}</td>
        <td>${operation.category}</td>
        <td>${formattedAmount} $</td>
        <td>${formattedDate}</td>
        <td>${operation.comment}</td>
        <td class="text-nowrap">
            ${CommonUtils.generateGridToolsColumn('operations', operation.id)}
        </td>
    `;
        return tr;
    }
}