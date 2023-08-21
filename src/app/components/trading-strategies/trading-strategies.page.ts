import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-trading-strategies',
  templateUrl: './trading-strategies.page.html',
  styleUrls: ['./trading-strategies.page.scss'],
})
export class TradingStrategiesPage implements OnInit {
  selectedStrategy: string = 'soros'; // Valor inicial

  @Output() strategyChanged = new EventEmitter<string>();

  initialBank: number = 1000; // Banca inicial para exemplo
  tradeHistory: any[] = []; // Histórico de trades
  
  constructor() { }

  ngOnInit() { }

  onStrategyChange() {
    this.strategyChanged.emit(this.selectedStrategy);
    this.generateTrades();
  }

  generateSorosTrades() {
    let availableAmount = this.initialBank;
    for (let i = 0; i < 10; i++) {
      const tradeAmount = Math.round(availableAmount * 0.02);
      this.tradeHistory.push({ id: i, amount: tradeAmount, status: 'pending' });
      availableAmount += tradeAmount;
    }
  }

  generateMaoFixaTrades() {
    const tradeAmount = this.initialBank * 0.02;
    for (let i = 0; i < 10; i++) {
      this.tradeHistory.push({ id: i, amount: tradeAmount, status: 'pending' });
    }
  }

  generateMartingaleTrades() {
    let tradeAmount = 5; // Valor inicial da aposta
    for (let i = 0; i < 10; i++) {
      this.tradeHistory.push({ id: i, amount: tradeAmount, status: 'pending' });
      tradeAmount *= 2; // Dobrar a aposta após cada perda
    }
  }

  generateSorosGaleTrades() {
    let availableAmount = this.initialBank;
    for (let i = 0; i < 10; i++) {
      const tradeAmount = Math.round(availableAmount * 0.02);
      this.tradeHistory.push({ id: i, amount: tradeAmount, status: 'pending' });
      availableAmount += tradeAmount;
      availableAmount *= 1.5; // Aumentar a aposta em 50% após cada perda
    }
  }

  generateTrades() {
    this.tradeHistory = [];
    
    switch (this.selectedStrategy) {
      case 'soros':
        this.generateSorosTrades();
        break;
      case 'maoFixa':
        this.generateMaoFixaTrades();
        break;
      case 'martingale':
        this.generateMartingaleTrades();
        break;
      case 'sorosGale':
        this.generateSorosGaleTrades();
        break;
      default:
        console.log('Estratégia desconhecida');
    }
  }
}
