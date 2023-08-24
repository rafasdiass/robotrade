import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-compound-interest',
  templateUrl: './compound-interest.page.html',
  styleUrls: ['./compound-interest.page.scss'],
})
export class CompoundInterestPage implements OnInit {

  // Valores padrão
  initialAmount: number = 100; // Valor inicial
  dailyGoal: number = 10; // Meta diária em porcentagem
  payout: number = 85; // Payout em porcentagem

  // Array para armazenar os resultados das 30 entradas
  entries: any[] = [];

  constructor() { }

  ngOnInit() {
    this.updateValues();
  }

  // Função para calcular juros compostos
  calculateCompoundInterest() {
    let totalAmount = this.initialAmount;
    const dailyMultiplier = 1 + (this.dailyGoal / 100);
    const payoutMultiplier = this.payout / 100;

    for (let i = 0; i < 30; i++) {
      totalAmount = totalAmount * dailyMultiplier;
      const profit = totalAmount * payoutMultiplier;
      totalAmount += profit;
      const result = Math.floor(totalAmount);
      this.entries.push({ result });
    }
  }

  // Função para atualizar o cálculo quando os valores são alterados
  updateValues() {
    this.entries = []; // Limpa o array de entradas
    this.calculateCompoundInterest();
  }
}
