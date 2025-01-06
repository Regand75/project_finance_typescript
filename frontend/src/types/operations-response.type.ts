export interface OperationsSuccessResponse {
    id: number,
    type: 'expense' | 'income',
    amount: number,
    date: string,
    comment: string,
    category: string,
}

export type OperationRequest =  {
    type: 'expense' | 'income',
    amount: number,
    date: string,
    comment: string,
    category_id: number,
}

export interface OperationsErrorResponse {
    error: boolean,
    message: string,
}
export type OperationsResponseType = OperationsSuccessResponse[] | OperationsErrorResponse | false;
export type OperationResponseType = OperationsSuccessResponse | OperationsErrorResponse | false;