import {BalanceService} from "../services/balance-service.js";

export class Balance {
    constructor() {
        this.balanceElement = document.getElementById("balance");
        this.getBalance().then();
    }

    async getBalance() {
        try {
            const balanceResult = await BalanceService.getBalance();
            if (balanceResult) {
                this.updateBalance(balanceResult);
            } else if (balanceResult.error) {
                console.log(balanceResult.error);
                location.href = '#/';
            }
        } catch (error) {
            console.log(error);
        }
    }

    updateBalance(balance) {
        this.balanceElement.innerText = balance.balance + '$';
    }
}