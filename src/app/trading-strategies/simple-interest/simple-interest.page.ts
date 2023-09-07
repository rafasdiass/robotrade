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
    let totalAmountCents = this.initialAmount * 100;  // Convert to cents
    const dailyGoalPercent = this.dailyGoal / 100; 
    const payoutPercent = this.payout / 100; 
    this.entries = [];
  
    let entryAmountCents = Math.round(totalAmountCents * dailyGoalPercent);  // Now in cents
  
    for (let i = 0; i < 30; i++) {
      const profitCents = Math.round(entryAmountCents * payoutPercent);  // Profit in cents
      totalAmountCents += profitCents;  // Total amount now in cents
  
      const entry = {
        day: i + 1,
        entryAmount: entryAmountCents / 100,  // Convert back to dollars for display
        profit: profitCents / 100,  // Convert back to dollars for display
        totalAmount: totalAmountCents / 100  // Convert back to dollars for display
      };
  
    
      entry.entryAmount = Number(entry.entryAmount.toFixed(2));
      entry.profit = Number(entry.profit.toFixed(2));
      entry.totalAmount = Number(entry.totalAmount.toFixed(2));
  
      this.entries.push(entry);
    }
  }
  
  // Função para atualizar o cálculo quando os valores são alterados
  updateValues() {
    this.entries = []; // Limpa o array de entradas
    this.calculateSimpleInterest();
  }
}
