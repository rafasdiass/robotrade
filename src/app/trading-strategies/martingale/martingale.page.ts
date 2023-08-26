import { Component, OnInit } from '@angular/core';

interface MartingaleEntry {
  round: number;
  currentBet: number;
  profit: number;
  totalAmount: number;
}

@Component({
  selector: 'app-martingale',
  templateUrl: './martingale.page.html',
  styleUrls: ['./martingale.page.scss'],
})
export class MartingalePage implements OnInit {

  // Valores padrão
  initialAmount: number = 100; // Valor inicial da aposta (perda inicial)
  payout: number = 85; // Payout em porcentagem

  // Array para armazenar os resultados das 3 entradas
  entries: MartingaleEntry[] = [];

  constructor() { }

  ngOnInit(): void {
    this.simulateMartingale();
  }

  simulateMartingale(): void {
    let currentBet: number = this.initialAmount * 2; // Aposta atual (o dobro da perda inicial)
    const payoutPercent: number = this.payout / 100; // Payout em porcentagem

    this.entries = []; // Limpa o array de entradas

    for (let i = 0; i < 3; i++) {
      const profit: number = currentBet * payoutPercent; // Calcula o lucro com base no payout
      const totalAmount: number = currentBet + profit; // Adiciona o lucro e a aposta atual ao total

      const entry: MartingaleEntry = { round: i + 1, currentBet, profit, totalAmount };
      this.entries.push(entry);

      currentBet *= 2; // A aposta para a próxima rodada é o dobro da aposta atual
    }
  }

  // Função para atualizar a simulação quando os valores são alterados
  updateValues(): void {
    this.entries = []; // Limpa o array de entradas
    this.simulateMartingale();
  }
}
