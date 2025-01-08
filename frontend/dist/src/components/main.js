"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = void 0;
const operations_service_1 = require("../services/operations-service");
const filter_utils_1 = require("../utils/filter-utils");
const auto_1 = __importDefault(require("chart.js/auto"));
class Main {
    constructor() {
        this.getContext = null;
        this.filtersContainer = document.getElementById('filters-container'); // Родительский контейнер кнопок фильтра
        if (this.filtersContainer) {
            this.filtersContainer.addEventListener('click', event => filter_utils_1.FilterUtils.handleFilterClick(event, this.updateCharts.bind(this)));
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
        const incomesCanvas = document.getElementById('pieChartIncomes');
        const expensesCanvas = document.getElementById('pieChartExpenses');
        this.ctxIncomes = incomesCanvas ? incomesCanvas.getContext('2d') : null;
        this.ctxExpenses = expensesCanvas ? expensesCanvas.getContext('2d') : null;
        // Инициализация диаграмм
        this.myPieChartIncomes = new auto_1.default(this.ctxIncomes, this.configIncomes);
        this.myPieChartExpenses = new auto_1.default(this.ctxExpenses, this.configExpenses);
        this.getOperations('today').then();
        // Инициализация datepicker
        filter_utils_1.FilterUtils.initializeDatepickers();
        if (!localStorage.getItem('accessToken')) {
            location.href = '#/login';
            return;
        }
    }
    async getOperations(period) {
        try {
            const operationsResult = await operations_service_1.OperationsService.getOperations(`?period=${period}`);
            if (operationsResult) {
                if (operationsResult.length > 0) {
                    this.updateCharts(operationsResult);
                }
                else {
                    // Если операций нет, отображаем "Нет данных"
                    this.updateCharts([]);
                }
            }
            else {
                // Ошибка
                location.href = '#/';
                return;
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    updateCharts(operationsResult) {
        const incomeCategories = {};
        const expenseCategories = {};
        operationsResult.forEach((operation) => {
            if (operation.type === "income") {
                incomeCategories[operation.category] =
                    (incomeCategories[operation.category] || 0) + operation.amount;
            }
            else if (operation.type === "expense") {
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
            if (chart.options.plugins && chart.options.plugins.tooltip) {
                chart.options.plugins.tooltip.enabled = false; // Отключаем всплывающие подсказки для заглушки
            }
        }
        else {
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
exports.Main = Main;
