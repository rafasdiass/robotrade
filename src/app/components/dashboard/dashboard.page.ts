import { Component, Injectable, inject } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Trade } from '../../models/trade.model';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  private _accountBalance: number = 0;
  private _initialBank: number = 0;
  private _currentValue: number = 0;
  private _dailyGoal: number = 0;
  tradeHistory: Trade[] = [];
  currentStrategy!: string;

  private modalController = inject(ModalController)
  private alertController = inject(AlertController)

  ngOnInit() { }

  get accountBalance(): number {
    return this._accountBalance;
  }

  set accountBalance(value: number) {
    this._accountBalance = value;
    this.calculateInitialBank();
  }

  get initialBank(): number {
    return this._initialBank;
  }

  get currentValue(): number {
    return this._currentValue;
  }

  get dailyGoal(): number {
    return this._dailyGoal;
  }

  set dailyGoal(value: number) {
    this._dailyGoal = value;
    this.generateTrades();
  }

  calculateInitialBank() {
    this._initialBank = this._accountBalance * 0.1;
    this.generateTrades();
  }

  generateTrades() {
    this.tradeHistory = [];
    let availableAmount = this._initialBank;
    const growthRate = this._dailyGoal / 100;

    for (let i = 0; i < 10; i++) {
      let tradeAmount = Math.round(availableAmount * growthRate);
      tradeAmount = Math.max(tradeAmount, 5);
      this.tradeHistory.push({ id: i, amount: tradeAmount, status: 'pending' });
      availableAmount += tradeAmount;
    }
  }

  addTrade() {
    this.checkForConsecutiveLosses();
  }

  async checkForConsecutiveLosses() {
    const lastTwoTrades = this.tradeHistory.slice(-2).map(trade => trade.status);
    if (lastTwoTrades.every(status => status === 'loss')) {
      const alert = await this.alertController.create({
        header: 'Atenção',
        message: 'Duas perdas consecutivas. Gostaria de pausar?',
        buttons: ['Cancelar', 'Pausar']
      });
      await alert.present();
    }
  }

  updateCurrentValue(event: any, trade: Trade) {
    const { value } = event.detail;
    trade.status = value;
    if (value === 'win') {
      this._currentValue += trade.amount;
    } else if (value === 'loss') {
      this._currentValue -= trade.amount;
    }
    this.checkForConsecutiveLosses();
  }

  updateCerco(trade: Trade) {
    if (trade.priceHedge === 'both') {
      this._currentValue += trade.amount * 2;
    } else if (trade.priceHedge === 'one') {
      this._currentValue += trade.amount;
    }
  }

  updateStrategy(newStrategy: string) {
    this.currentStrategy = newStrategy;
    this.generateTrades();
  }
}
