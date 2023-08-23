import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-soros-strategy',
  templateUrl: './soros-strategy.page.html',
  styleUrls: ['./soros-strategy.page.scss'],
})
export class SorosStrategyPage implements OnInit {
  selectedStrategy: string = 'soros'; // Valor inicial
  lossValue: number = 0; // Valor da perda inicial
  tradeHistory: any[] = []; // Histórico de trades

  constructor() { }

  ngOnInit() { }

  onStrategyChange() {
    this.generateTrades();
  }

  onLossValueChange(value: number) {
    this.lossValue = value;
    this.generateTrades();
  }

  generateTrades() {
    this.tradeHistory = [];
    let availableAmount = this.lossValue;

    switch (this.selectedStrategy) {
      case 'soros':
        this.generateSorosTrades(availableAmount);
        break;
      case 'maoFixa':
        this.generateMaoFixaTrades(availableAmount);
        break;
      case 'martingale':
        this.generateMartingaleTrades(availableAmount);
        break;
      case 'sorosGale':
        this.generateSorosGaleTrades(availableAmount);
        break;
      default:
        console.log('Estratégia desconhecida');
    }
  }

  generateSorosTrades(availableAmount: number) {
    for (let i = 0; i < 10; i++) {
      const tradeAmount = Math.round(availableAmount * 0.02);
      this.tradeHistory.push({ id: i, amount: tradeAmount, status: 'pending' });
      availableAmount += tradeAmount;
    }
  }

  generateMaoFixaTrades(availableAmount: number) {
    const tradeAmount = availableAmount * 0.02;
    for (let i = 0; i < 10; i++) {
      this.tradeHistory.push({ id: i, amount: tradeAmount, status: 'pending' });
    }
  }

  generateMartingaleTrades(availableAmount: number) {
    let tradeAmount = 5;
    for (let i = 0; i < 10; i++) {
      this.tradeHistory.push({ id: i, amount: tradeAmount, status: 'pending' });
      tradeAmount *= 2;
    }
  }

  generateSorosGaleTrades(availableAmount: number) {
    for (let i = 0; i < 10; i++) {
      const tradeAmount = Math.round(availableAmount * 0.02);
      this.tradeHistory.push({ id: i, amount: tradeAmount, status: 'pending' });
      availableAmount += tradeAmount;
      availableAmount *= 1.5;
    }
  }
}
