import {OperationsService} from "../services/operations-service";
import 'bootstrap-datepicker';
import {OperationsResponseType} from "../types/operations-response.type";

export class FilterUtils {

    public static initializeDatepickers(): void {
        ($('#date-from') as any).datepicker({
            format: 'dd.mm.yyyy',
            autoclose: 'off',
            todayHighlight: true,
            language: 'ru',
        });

        ($('#date-to') as any).datepicker({
            format: 'dd.mm.yyyy',
            autoclose: 'off',
            todayHighlight: true,
            language: 'ru',
        });

        ($('#date') as any).datepicker({
            format: 'dd.mm.yyyy',
            autoclose: true,
            todayHighlight: true,
            language: 'ru',
        });
    }

    private static convertDate(dateString): string {
        // Разделяем строку по точке
        const [day, month, year]: [string, string, string] = dateString.split('.');
        // Возвращаем дату в формате год-месяц-день
        return `${year}-${month}-${day}`;
    }

    public static async handleFilterClick(event: MouseEvent, showRecords: void | null = null, updateChart: void | null = null): Promise<void> {
        const target: Element | null = (event.target as Element).closest('button[data-period]');
        const filterIntervalHiddenElement: HTMLElement | null = document.getElementById('filter-block');
        if (target) {
            document.querySelectorAll('button[data-period]').forEach(btn => btn.classList.remove('btn-secondary'));
            target.classList.add('btn-secondary');
            if (filterIntervalHiddenElement) {
                filterIntervalHiddenElement.classList.add('filter-interval-hidden');
            }
            const period: string = target.getAttribute('data-period');

            if (period === 'interval') {
                let inputDateFromValue: string | null = null;
                let inputDateToValue: string | null = null;
                const inputDateFrom: HTMLElement | null = document.getElementById('date-from');
                if (inputDateFrom instanceof HTMLInputElement) {
                    inputDateFromValue = inputDateFrom.value;
                }
                const inputDateTo: HTMLElement | null = document.getElementById('date-to');
                if (inputDateTo instanceof HTMLInputElement) {
                    inputDateToValue = inputDateTo.value;
                }
                if (filterIntervalHiddenElement) {
                    filterIntervalHiddenElement.classList.remove('filter-interval-hidden');
                }

                if (!inputDateFromValue && !inputDateToValue) {
                    // Обновление данных при выборе дат
                    const updateIntervalData = async (): Promise<void> => {
                        const dateFromValue: Date | null = $('#date-from').datepicker('getDate'); // Получаем дату
                        const dateToValue: Date | null = $('#date-to').datepicker('getDate');
                        if (dateFromValue && dateToValue) {
                            const convertedFrom: string = this.convertDate(
                                dateFromValue.toLocaleDateString('ru-RU',
                                    {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })
                            );
                            const convertedTo: string = this.convertDate(
                                dateToValue.toLocaleDateString('ru-RU',
                                    {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })
                            );
                            try {
                                // Обновляем запрос с параметрами дат
                                const operationsResult: OperationsResponseType = await OperationsService.getOperations(
                                    `?period=${period}&dateFrom=${convertedFrom}&dateTo=${convertedTo}`
                                );
                                // Проверяем, является ли результат ошибкой
                                if ('error' in operationsResult && operationsResult.error) {
                                    console.error('Error:', operationsResult.message);
                                    location.href = '#/';
                                } else {
                                    // Здесь operationsResult гарантированно является OperationsSuccessResponse[]
                                    if (showRecords) {
                                        showRecords(operationsResult); // Обновляем записи
                                    }
                                    if (updateChart) {
                                        updateChart(operationsResult); // Обновляем графики
                                    }
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
                        const convertedFromValue: string = this.convertDate(inputDateFromValue);
                        const convertedToValue: string = this.convertDate(inputDateToValue);
                        // Обновляем запрос с параметрами дат
                        const operationsResult: OperationsResponseType = await OperationsService.getOperations(
                            `?period=${period}&dateFrom=${convertedFromValue}&dateTo=${convertedToValue}`
                        );
                        // Проверяем, является ли результат ошибкой
                        if ('error' in operationsResult && operationsResult.error) {
                            console.error('Error:', operationsResult.message);
                            location.href = '#/';
                        } else {
                            // Здесь operationsResult гарантированно является OperationsSuccessResponse[]
                            if (showRecords) {
                                showRecords(operationsResult); // Обновляем записи
                            }
                            if (updateChart) {
                                updateChart(operationsResult); // Обновляем графики
                            }
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            } else {
                try {
                    const operationsResult: OperationsResponseType = await OperationsService.getOperations(`?period=${period}`);
                    // Проверяем, является ли результат ошибкой
                    if ('error' in operationsResult && operationsResult.error) {
                        console.error('Error:', operationsResult.message);
                        location.href = '#/';
                    } else {
                        // Здесь operationsResult гарантированно является OperationsSuccessResponse[]
                        if (showRecords) {
                            showRecords(operationsResult); // Обновляем записи
                        }
                        if (updateChart) {
                            updateChart(operationsResult); // Обновляем графики
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
}