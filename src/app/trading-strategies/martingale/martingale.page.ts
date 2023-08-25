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
  initialAmount: number = 10; // Valor inicial da aposta
  payout: number = 85; // Payout em porcentagem

  // Array para armazenar os resultados das 4 entradas
  entries: MartingaleEntry[] = [];

  constructor() { }

  ngOnInit(): void {
    this.simulateMartingale();
  }

  simulateMartingale(): void {
    let totalAmount: number = 1000; // Valor inicial da banca
    let currentBet: number = this.initialAmount; // Aposta atual
    const payoutPercent: number = this.payout / 100; // Payout em porcentagem

    this.entries = []; // Limpa o array de entradas

    for (let i = 0; i < 4; i++) {
      const profit: number = currentBet * payoutPercent; // Calcula o lucro com base no payout

      // Como sempre há vitória
      totalAmount += profit;
      currentBet = this.initialAmount; // Redefine a aposta para o valor inicial

      totalAmount = parseFloat(totalAmount.toFixed(2)); // Arredonda para duas casas decimais e converte de volta para número

      const entry: MartingaleEntry = { round: i + 1, currentBet, profit, totalAmount };
      this.entries.push(entry);
    }
  }

  // Função para atualizar a simulação quando os valores são alterados
  updateValues(): void {
    this.entries = []; // Limpa o array de entradas
    this.simulateMartingale();
  }
}
