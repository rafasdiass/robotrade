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

  calculateCompoundInterest() {
    let totalAmount = this.initialAmount; // Valor inicial da banca
    const dailyGoalPercent = this.dailyGoal / 100; // Meta diária em porcentagem
    const payoutPercent = this.payout / 100; // Payout em porcentagem
  
    this.entries = []; // Limpa o array de entradas
  
    for (let i = 0; i < 30; i++) {
      let entryAmount = totalAmount * dailyGoalPercent; // Calcula o valor da entrada com base na meta diária
      
      // Arredonda o valor da entrada para o número inteiro mais próximo
      entryAmount = Math.round(entryAmount);
  
      const profit = entryAmount * payoutPercent; // Calcula o lucro com base no payout
  
      totalAmount = totalAmount - entryAmount + entryAmount + profit; // Atualiza o valor total da banca
      totalAmount = parseFloat(totalAmount.toFixed(2)); // Arredonda para duas casas decimais e converte de volta para número
  
      this.entries.push({ day: i + 1, entryAmount, profit, totalAmount });
    }
  }
  
  // Função para atualizar o cálculo quando os valores são alterados
  updateValues() {
    this.entries = []; // Limpa o array de entradas
    this.calculateCompoundInterest();
  }
}
