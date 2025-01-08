"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Balance = void 0;
const balance_service_1 = require("../services/balance-service");
class Balance {
    constructor() {
        this.balanceElement = document.getElementById("balance");
        this.getBalance().then();
    }
    async getBalance() {
        try {
            const balanceResult = await balance_service_1.BalanceService.getBalance();
            if (balanceResult) {
                this.updateBalance(balanceResult);
            }
            else {
                location.href = '#/';
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    updateBalance(balance) {
        if (this.balanceElement) {
            this.balanceElement.innerText = balance.balance + '$';
        }
    }
}
exports.Balance = Balance;
