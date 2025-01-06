import {OperationsService} from "../services/operations-service";
import {FilterUtils} from "../utils/filter-utils";
import Chart, {ChartConfiguration} from "chart.js";
import {OperationsResponseType, OperationsSuccessResponse} from "../types/operations-response.type";

export class Main {
    readonly filtersContainer: HTMLElement | null;
    readonly defaultData: any;
    readonly configIncomes: ChartConfiguration;
    readonly configExpenses: ChartConfiguration;
    readonly ctxIncomes: CanvasRenderingContext2D;
    readonly ctxExpenses: CanvasRenderingContext2D;
    readonly getContext: CanvasRenderingContext2D | null;
    readonly myPieChartIncomes: Chart;
    readonly myPieChartExpenses: Chart;

    constructor() {
        this.filtersContainer = document.getElementById('filters-container'); // Родительский контейнер кнопок фильтра

        if (this.filtersContainer) {
            this.filtersContainer.addEventListener('click', event =>
                FilterUtils.handleFilterClick(event, this.updateCharts.bind(this))
            );
        }

        if (!localStorage.getItem('accessToken')) {
            return location.href = '#/login';
        }

        this.defaultData = {
            labels: ["Нет данных"], // Метка для отсутствия данных
            datasets: [
                {
                    label: "Данные отсутствуют",
                    data: [1], // Заглушка для отображения
                    backgroundColor: ["#d3d3d3"], // Светлый цвет
                    borderWidth: 1
                }
            ]
        };

        this.configIncomes = {
            type: 'pie',
            data: this.defaultData, // Подключение данных
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
            },
        };

        this.configExpenses = {
            type: 'pie',
            data: this.defaultData, // Подключение данных
            options: {
                responsive: true, // Диаграмма адаптируется к размерам контейнера
                plugins: {
                    legend: {
                        position: 'top', // Положение легенды
                    },
                    tooltip: {
                        enabled: false,
                    },
                }
            },
        };
        // Инициализация диаграммы
        this.ctxIncomes = (document.getElementById('pieChartIncomes') as HTMLCanvasElement).getContext('2d');
        this.ctxExpenses = (document.getElementById('pieChartExpenses') as HTMLCanvasElement).getContext('2d');
        this.myPieChartIncomes = new Chart(this.ctxIncomes, this.configIncomes);
        this.myPieChartExpenses = new Chart(this.ctxExpenses, this.configExpenses);

        this.getOperations('today').then();

        // Инициализация datepicker
        FilterUtils.initializeDatepickers();
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
        const incomeCategories: {} = {};
        const expenseCategories: {} = {};

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
    private updateChart(chart: any, categoryData: Record<string, number>): void {
        const labels: string[] = Object.keys(categoryData);
        const data: unknown[] = Object.values(categoryData);

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
            chart.options.plugins.tooltip.enabled = false; // Отключаем всплывающие подсказки для заглушки
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
            chart.options.plugins.tooltip.enabled = true; // Включаем всплывающие подсказки для реальных данных
        }
        chart.update();
    }
}