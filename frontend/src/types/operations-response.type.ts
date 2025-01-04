interface OperationsSuccessResponse {
    id: number;
    type: 'expense' | 'income';
    amount: number;
    date: string;
    comment: string;
    category: string;
}

interface OperationsErrorResponse {
    error: true;
    message: string;
}
export type OperationsResponseType = OperationsSuccessResponse[] | OperationsErrorResponse;