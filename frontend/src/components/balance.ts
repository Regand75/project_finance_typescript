import {BalanceService} from "../services/balance-service";
import {BalanceResponseType, BalanceSuccessType} from "../types/balance-response.type";

export class Balance {
    private balanceElement: HTMLElement | null;

    constructor() {
        this.balanceElement = document.getElementById("balance");
        this.getBalance().then();
    }

    private async getBalance(): Promise<void> {
        try {
            const balanceResult: BalanceResponseType | false = await BalanceService.getBalance();
            if (balanceResult) {
                this.updateBalance(balanceResult as BalanceSuccessType);
            } else {
                location.href = '#/';
                return;
            }
        } catch (error) {
            console.log(error);
        }
    }

    private updateBalance(balance: BalanceSuccessType): void {
        if (this.balanceElement) {
            this.balanceElement.innerText = balance.balance + '$';
        }
    }
}