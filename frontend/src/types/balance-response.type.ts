export interface BalanceSuccessType {
    balance: number;
}

export interface BalanceErrorResponse {
    error: boolean,
    message: string,
}

export type BalanceResponseType = BalanceSuccessType | BalanceErrorResponse | false;
