import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-simple-interest',
  templateUrl: './simple-interest.page.html',
  styleUrls: ['./simple-interest.page.scss'],
})
export class SimpleInterestPage implements OnInit {

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

  calculateSimpleInterest() {
    let totalAmount = this.initialAmount; // Valor inicial da banca
    const dailyGoalPercent = this.dailyGoal / 100; // Meta diária em porcentagem
    const payoutPercent = this.payout / 100; // Payout em porcentagem

    this.entries = []; // Limpa o array de entradas

    for (let i = 0; i < 30; i++) {
      let entryAmount = totalAmount * dailyGoalPercent; // Calcula o valor da entrada com base na meta diária
      entryAmount = Math.floor(entryAmount); // Arredonda para um número inteiro
      const profit = entryAmount * payoutPercent; // Calcula o lucro com base no payout

      totalAmount += profit; // Atualiza o valor total da banca usando juros simples
      this.entries.push({ day: i + 1, entryAmount, profit, totalAmount: Math.floor(totalAmount) });
    }
  }

  // Função para atualizar o cálculo quando os valores são alterados
  updateValues() {
    this.entries = []; // Limpa o array de entradas
    this.calculateSimpleInterest();
  }
}
