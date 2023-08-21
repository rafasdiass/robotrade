import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  private _accountBalance: number = 0;
  initialBank: number = 0;
  tradeHistory: any[] = [];

  constructor() { }

  ngOnInit() {
    // A banca inicial será calculada quando o saldo da conta for atualizado
  }

  get accountBalance(): number {
    return this._accountBalance;
  }

  set accountBalance(value: number) {
    this._accountBalance = value;
    this.calculateInitialBank();
  }

  calculateInitialBank() {
    this.initialBank = this._accountBalance * 0.1;
    this.generateTrades();
  }

  generateTrades() {
    this.tradeHistory = [];
    let nextAmount = this.initialBank / 10;
    // Se o valor inicial for menor que 5, fixe-o como 5
    nextAmount = Math.max(nextAmount, 5);

    for (let i = 0; i < 10; i++) {
      // Arredonda para o número inteiro mais próximo
      const roundedAmount = Math.round(nextAmount);

      this.tradeHistory.push({
        id: i,
        amount: roundedAmount,
        status: 'pending'
      });

      nextAmount += nextAmount * 0.1;  // 10% Juros simples
    }
  }

  addTrade() {
    // Você pode adicionar mais lógica aqui para adicionar negociações
  }
}
