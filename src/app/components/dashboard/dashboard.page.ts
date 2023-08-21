import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  private _accountBalance: number = 0;
  initialBank: number = 0;
  currentValue: number = 0;
  tradeHistory: any[] = [];
  private _dailyGoal: number = 0; // Meta diária em %

  constructor(private modalController: ModalController, private alertController: AlertController) { }

  ngOnInit() { }

  get accountBalance(): number {
    return this._accountBalance;
  }

  set accountBalance(value: number) {
    this._accountBalance = value;
    this.calculateInitialBank();
  }

  get dailyGoal(): number {
    return this._dailyGoal;
  }

  set dailyGoal(value: number) {
    this._dailyGoal = value;
    this.generateTrades();
  }

  calculateInitialBank() {
    this.initialBank = this._accountBalance * 0.1;
    this.generateTrades();
  }

  generateTrades() {
    this.tradeHistory = [];
    let availableAmount = this.initialBank;
    const growthRate = this.dailyGoal / 100;

    for (let i = 0; i < 10; i++) {
      let tradeAmount = Math.round(availableAmount * growthRate);
      
      // Asegura que o valor da trade seja pelo menos 5
      tradeAmount = Math.max(tradeAmount, 5);

      this.tradeHistory.push({
        id: i,
        amount: tradeAmount,
        status: 'pending'
      });

      // Para juros simples, nós adicionamos o valor da trade ao valor disponível
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

  updateCurrentValue(event: any, trade: any) {
    const { value } = event.detail;
    trade.status = value;

    if (value === 'win') {
      this.currentValue += trade.amount;
    } else if (value === 'loss') {
      this.currentValue -= trade.amount;
    }

    this.checkForConsecutiveLosses();
  }
  updateCerco(trade: any) {
    if (trade.priceHedge === 'both') {
      this.currentValue += trade.amount * 2;
    } else if (trade.priceHedge === 'one') {
      this.currentValue += trade.amount;
    }
  }

}
