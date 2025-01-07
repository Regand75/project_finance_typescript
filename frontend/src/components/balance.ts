import {BalanceService} from "../services/balance-service";
import {BalanceResponseType} from "../types/balance-response.type";

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
                this.updateBalance(balanceResult);
            } else {
                location.href = '#/';
            }
        } catch (error) {
            console.log(error);
        }
    }

    private updateBalance(balance: BalanceResponseType): void {
        if (this.balanceElement) {
            this.balanceElement.innerText = balance.balance + '$';
        }
    }
}