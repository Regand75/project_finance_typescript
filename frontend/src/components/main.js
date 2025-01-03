import {OperationsService} from "../services/operations-service.js";
import {FilterUtils} from "../utils/filter-utils.js";

export class Main {
    constructor() {
        this.filtersContainer = document.getElementById('filters-container'); // Родительский контейнер кнопок фильтра

        this.filtersContainer.addEventListener('click', event =>
            FilterUtils.handleFilterClick(event, this.updateCharts.bind(this))
        );
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
        this.ctxIncomes = document.getElementById('pieChartIncomes').getContext('2d');
        this.ctxExpenses = document.getElementById('pieChartExpenses').getContext('2d');
        this.myPieChartIncomes = new Chart(this.ctxIncomes, this.configIncomes);
        this.myPieChartExpenses = new Chart(this.ctxExpenses, this.configExpenses);

        this.getOperations('today').then();

        // Инициализация datepicker
        FilterUtils.initializeDatepickers();
    }

    async getOperations(period) {
        try {
            const operationsResult = await OperationsService.getOperations(`?period=${period}`);
            if (operationsResult && operationsResult.length > 0) {
                this.updateCharts(operationsResult);

            } else if (operationsResult.error) {
                console.log(operationsResult.error);
                location.href = '#/';
            } else {
                // Если операций нет, отображаем "Нет данных"
                this.updateCharts([]);
            }
        } catch (error) {
            console.log(error);
        }
    }

    updateCharts(operationsResult) {
        const incomeCategories = {};
        const expenseCategories = {};

        operationsResult.forEach(operation => {
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
    updateChart(chart, categoryData) {
        const labels = Object.keys(categoryData);
        const data = Object.values(categoryData);

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