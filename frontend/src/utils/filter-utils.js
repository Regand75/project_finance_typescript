import {OperationsService} from "../services/operations-service.js";

export class FilterUtils {

    static initializeDatepickers() {
        $('#date-from').datepicker({
            format: 'dd.mm.yyyy',
            autoclose: 'off',
            todayHighlight: true,
            language: 'ru',
        });

        $('#date-to').datepicker({
            format: 'dd.mm.yyyy',
            autoclose: 'off',
            todayHighlight: true,
            language: 'ru',
        });

        $('#date').datepicker({
            format: 'dd.mm.yyyy',
            autoclose: true,
            todayHighlight: true,
            language: 'ru',
        });
    }

    static convertDate(dateString) {
        // Разделяем строку по точке
        const [day, month, year] = dateString.split('.');
        // Возвращаем дату в формате год-месяц-день
        return `${year}-${month}-${day}`;
    }

    static async handleFilterClick(event, showRecords = null, updateChart = null) {
        const target = event.target.closest('button[data-period]');
        const filterIntervalHiddenElement = document.getElementById('filter-block');
        if (target) {
            document.querySelectorAll('button[data-period]').forEach(btn => btn.classList.remove('btn-secondary'));
            target.classList.add('btn-secondary');
            filterIntervalHiddenElement.classList.add('filter-interval-hidden');

            const period = target.getAttribute('data-period');

            if (period === 'interval') {
                const inputDateFromValue = document.getElementById('date-from').value;
                const inputDateToValue = document.getElementById('date-to').value;
                filterIntervalHiddenElement.classList.remove('filter-interval-hidden');

                if (!inputDateFromValue && !inputDateToValue) {
                    // Обновление данных при выборе дат
                    const updateIntervalData = async () => {
                        const dateFromValue = $('#date-from').datepicker('getDate'); // Получаем дату
                        const dateToValue = $('#date-to').datepicker('getDate');
                        if (dateFromValue && dateToValue) {
                            const convertedFrom = this.convertDate(
                                dateFromValue.toLocaleDateString('ru-RU',
                                    {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })
                            );
                            const convertedTo = this.convertDate(
                                dateToValue.toLocaleDateString('ru-RU',
                                    {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })
                            );
                            try {
                                // Обновляем запрос с параметрами дат
                                const operationsResult = await OperationsService.getOperations(
                                    `?period=${period}&dateFrom=${convertedFrom}&dateTo=${convertedTo}`
                                );
                                if (operationsResult) {
                                    if (showRecords) {
                                        showRecords(operationsResult); // Обновляем записи
                                    }
                                    if (updateChart) {
                                        updateChart(operationsResult); // Обновляем графики
                                    }
                                } else if (operationsResult.error) {
                                    console.log(operationsResult.error);
                                    location.href = '#/';
                                }

                            } catch (error) {
                                console.log(error);
                            }
                        }
                    };
                    // Убираем старые обработчики, чтобы избежать дублирования
                    $('#date-from').off('changeDate').on('changeDate', updateIntervalData);
                    $('#date-to').off('changeDate').on('changeDate', updateIntervalData);
                } else if (inputDateFromValue && inputDateToValue) {
                    try {
                        const convertedFromValue = this.convertDate(inputDateFromValue);
                        const convertedToValue = this.convertDate(inputDateToValue);
                        // Обновляем запрос с параметрами дат
                        const operationsResult = await OperationsService.getOperations(
                            `?period=${period}&dateFrom=${convertedFromValue}&dateTo=${convertedToValue}`
                        );
                        if (operationsResult) {
                            if (showRecords) {
                                showRecords(operationsResult); // Обновляем записи
                            }
                            if (updateChart) {
                                updateChart(operationsResult); // Обновляем графики
                            }
                        } else if (operationsResult.error) {
                            console.log(operationsResult.error);
                            location.href = '#/';
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            } else {
                try {
                    const operationsResult = await OperationsService.getOperations(`?period=${period}`);
                    if (operationsResult) {
                        if (showRecords) {
                            showRecords(operationsResult); // Обновляем записи
                        }
                        if (updateChart) {
                            updateChart(operationsResult); // Обновляем графики
                        }
                    } else if (operationsResult.error) {
                        console.log(operationsResult.error);
                        location.href = '#/';
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
}