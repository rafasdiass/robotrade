import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-soros-strategy',
  templateUrl: './soros-strategy.page.html',
  styleUrls: ['./soros-strategy.page.scss'],
})
export class SorosStrategyPage implements OnInit {
  lossValue: number = 0;  // Iniciado como 0
  payout: number = 0; 
  levels = [1, 2, 3];
  sorosTrades: any[] = [];
  maoFixaTrades: any[] = [];
  sorosGaleTrades: any[] = [];
  sorosMartingaleTrades: any[] = [];

  constructor() { }

  ngOnInit() { }
  onLossValueChange() {
    if (this.lossValue > 0 && this.payout > 0) {
      this.generateAllTrades();
    }
  }
  
  onPayoutChange() {
    if (this.lossValue > 0 && this.payout > 0) {
      this.generateAllTrades();
    }
  }
  
  generateAllTrades() {
    if (this.lossValue > 0 && this.payout > 0) {
      this.sorosTrades = this.levels.map(level => this.generateSorosTrades(this.lossValue, this.payout, level));
      this.maoFixaTrades = this.levels.map(level => this.generateMaoFixaTrades(this.lossValue, level));
      this.sorosGaleTrades = this.levels.map(level => this.generateSorosGaleTrades(this.lossValue, this.payout, level));
      this.sorosMartingaleTrades = this.levels.map(level => this.generateSorosMartingaleTrades(this.lossValue, this.payout, level));
    }
  }

  generateSorosTrades(availableAmount: number, payout: number, level: number) {
    const trades = [];
    let tradeAmount = availableAmount;
    const winAmount = tradeAmount * (payout / 100);
    trades.push({ id: 0, amount: tradeAmount, status: 'pending' });
    return trades;
  }

  generateMaoFixaTrades(availableAmount: number, level: number) {
    const trades = [];
    const tradeAmount = availableAmount;
    trades.push({ id: 0, amount: tradeAmount, status: 'pending' });
    return trades;
  }

  generateSorosGaleTrades(availableAmount: number, payout: number, level: number) {
    const trades = [];
    let tradeAmount = availableAmount;
    const winAmount = tradeAmount * (payout / 100);
    trades.push({ id: 0, amount: tradeAmount, status: 'pending' });
    return trades;
  }

  generateSorosMartingaleTrades(availableAmount: number, payout: number, level: number) {
    const trades = [];
    let tradeAmount = availableAmount;
    trades.push({ id: 0, amount: tradeAmount, status: 'pending' });
    return trades;
  }
}
