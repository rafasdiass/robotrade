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

  constructor(private modalController: ModalController, private alertController: AlertController) { }

  ngOnInit() { }

  get accountBalance(): number {
    return this._accountBalance;
  }

  set accountBalance(value: number) {
    this._accountBalance = value;
    this.calculateInitialBank();
  }

  calculateInitialBank() {
    this.initialBank = this._accountBalance * 0.1;
    this.generateTrades();
  }

  generateTrades() {
    this.tradeHistory = [];
    let nextAmount = this.initialBank / 10;
    nextAmount = Math.max(nextAmount, 5);

    for (let i = 0; i < 10; i++) {
      const roundedAmount = Math.round(nextAmount);
      this.tradeHistory.push({
        id: i,
        amount: roundedAmount,
        status: 'pending'
      });
      nextAmount += nextAmount * 0.1;
    }
  }

  addTrade() {
    this.checkForConsecutiveLosses();
  }

  async checkForConsecutiveLosses() {
    const lastTwoTrades = this.tradeHistory.slice(-2).map(trade => trade.status);
    console.log('Últimos dois trades:', lastTwoTrades);

    if (lastTwoTrades.every(status => status === 'loss')) {
      console.log('Abrindo modal');
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
    console.log(`Status atualizado para: ${value} com o montante: ${trade.amount}`);

    trade.status = value;

    if (value === 'win') {
      this.currentValue += trade.amount;
    } else if (value === 'loss') {
      this.currentValue -= trade.amount;
    }

    this.checkForConsecutiveLosses();
  }
}
