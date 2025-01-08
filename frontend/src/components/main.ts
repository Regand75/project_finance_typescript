import {OperationsService} from "../services/operations-service";
import {FilterUtils} from "../utils/filter-utils";
import Chart, {ChartConfiguration, ChartType} from "chart.js/auto";
import {OperationsResponseType, OperationsSuccessResponse} from "../types/operations-response.type";

export class Main {
    readonly filtersContainer: HTMLElement | null;
    readonly defaultData: ChartConfiguration<'pie'>; // Указываем тип диаграммы
    readonly configIncomes: ChartConfiguration<'pie'>;
    readonly configExpenses: ChartConfiguration<'pie'>;
    readonly ctxIncomes: CanvasRenderingContext2D | null;
    readonly ctxExpenses: CanvasRenderingContext2D | null;
    readonly getContext: CanvasRenderingContext2D | null = null;
    readonly myPieChartIncomes: Chart<'pie'>; // Указываем тип диаграммы
    readonly myPieChartExpenses: Chart<'pie'>; // Указываем тип диаграммы

    constructor() {
        this.filtersContainer = document.getElementById('filters-container'); // Родительский контейнер кнопок фильтра

        if (this.filtersContainer) {
            this.filtersContainer.addEventListener('click', event =>
                FilterUtils.handleFilterClick(event, this.updateCharts.bind(this))
            );
        }

        this.defaultData = {
            type: 'pie', // Указываем тип диаграммы
            data: {
                labels: ["Нет данных"], // Метка для отсутствия данных
                datasets: [
                    {
                        label: "Данные отсутствуют",
                        data: [1], // Заглушка для отображения
                        backgroundColor: ["#d3d3d3"], // Светлый цвет
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true, // Диаграмма адаптируется к размерам контейнера
                plugins: {
                    legend: {
                        position: 'top', // Положение легенды
                    },
                    tooltip: {
                        enabled: false, // Отключаем подсказки для заглушки
                    },
                }
            }
        };

        this.configIncomes = {
            type: 'pie', // Указываем тип диаграммы
            data: this.defaultData.data, // Подключение данных
            options: this.defaultData.options
        };

        this.configExpenses = {
            type: 'pie', // Указываем тип диаграммы
            data: this.defaultData.data, // Подключение данных
            options: this.defaultData.options
        };

        // Инициализация диаграммы
        const incomesCanvas = document.getElementById('pieChartIncomes') as HTMLCanvasElement | null;
        const expensesCanvas = document.getElementById('pieChartExpenses') as HTMLCanvasElement | null;

        this.ctxIncomes = incomesCanvas ? incomesCanvas.getContext('2d') : null;
        this.ctxExpenses = expensesCanvas ? expensesCanvas.getContext('2d') : null;

        // Инициализация диаграмм
        this.myPieChartIncomes = new Chart(this.ctxIncomes!, this.configIncomes);
        this.myPieChartExpenses = new Chart(this.ctxExpenses!, this.configExpenses);

        this.getOperations('today').then();

        // Инициализация datepicker
        FilterUtils.initializeDatepickers();

        if (!localStorage.getItem('accessToken')) {
            location.href = '#/login';
            return;
        }
    }

    private async getOperations(period: string): Promise<void> {
        try {
            const operationsResult: OperationsResponseType = await OperationsService.getOperations(`?period=${period}`);
            if (operationsResult) {
                if ((operationsResult as OperationsSuccessResponse[]).length > 0) {
                    this.updateCharts((operationsResult as OperationsSuccessResponse[]));
                } else {
                    // Если операций нет, отображаем "Нет данных"
                    this.updateCharts([]);
                }
            } else {
                // Ошибка
                location.href = '#/';
                return;
            }
        } catch (error) {
            console.log(error);
        }
    }

    private updateCharts(operationsResult: OperationsSuccessResponse[]): void {
        const incomeCategories: Record<string, number> = {};
        const expenseCategories: Record<string, number> = {};

        operationsResult.forEach((operation: OperationsSuccessResponse): void => {
            if (operation.type === "income") {
                incomeCategories[operation.category] =
                    (incomeCategories[operation.category] || 0) + operation.amount;
            } else if (operation.type === "expense") {
                expenseCategories[operation.category] =
                    (expenseCategories[operation.category] || 0) + operation.amount;
            }
        });

        // Обновляем графики
        this.updateChart(this.myPieChartIncomes, incomeCategories);
        this.updateChart(this.myPieChartExpenses, expenseCategories);
    }

    // Метод для обновления диаграмм
    private updateChart(chart: Chart<'pie'>, categoryData: Record<string, number>): void {
        const labels: string[] = Object.keys(categoryData);
        const data: number[] = Object.values(categoryData);

        if (labels.length === 0 || data.length === 0) {
            // Если данных нет, отображаем заглушку
            chart.data = {
                labels: ["Нет данных"],
                datasets: [
                    {
                        label: "Данные отсутствуют",
                        data: [1],
                        backgroundColor: ["#d3d3d3"],
                        borderWidth: 1,
                    },
                ],
            };
            if (chart.options.plugins && chart.options.plugins.tooltip) {
                chart.options.plugins.tooltip.enabled = false; // Отключаем всплывающие подсказки для заглушки
            }
        } else {
            // Если данные есть, обновляем график
            chart.data = {
                labels: labels,
                datasets: [
                    {
                        label: "Сумма",
                        data: data,
                        backgroundColor: [
                            "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
                        ], // Настройте цвета
                        borderWidth: 1,
                    },
                ],
            };
            if (chart.options.plugins && chart.options.plugins.tooltip) {
                chart.options.plugins.tooltip.enabled = true; // Включаем всплывающие подсказки для реальных данных
            }
        }
        chart.update();
    }
}