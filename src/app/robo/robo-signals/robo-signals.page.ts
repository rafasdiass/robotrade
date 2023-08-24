import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoboService } from '../../services/robo.service';
import { CurrencyPairService } from '../../services/currency-pair.service';
import { ApiService } from '../../services/api.service';  // Importe ApiService

interface RobotSignal {
  time: string;
  action: string;
  currencyPair: string;
}
@Component({
  selector: 'app-robo-signals',
  templateUrl: './robo-signals.page.html',
  styleUrls: ['./robo-signals.page.scss'],
})
export class RoboSignalsPage implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  public signals: RobotSignal[] = [];
  private updateInterval: any;

  constructor(
    private roboService: RoboService,
    private currencyPairService: CurrencyPairService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.apiService.validateAPI().subscribe(
      data => console.log('API is working', data),
      error => console.log('API is not working', error)
    );

    const currencyPairSubscription = this.currencyPairService.currencyPairs$.subscribe(pairs => {
      this.updateSignals(pairs);
    });

    this.subscriptions.push(currencyPairSubscription);

    // Atualiza os sinais a cada 5 minutos (300000 ms)
    this.updateInterval = setInterval(() => {
      this.updateSignals(this.currencyPairService.currencyPairs$.getValue());
    }, 300000);
  }

  updateSignals(pairs: string[]) {
    console.log('Novos pares de moedas:', pairs);
    pairs.forEach(pair => {
      this.roboService.decideAcao(pair).subscribe(signal => {
        console.log('Sinal recebido:', signal);
        const robotSignal: RobotSignal = {
          time: new Date().toLocaleTimeString(),
          action: signal,
          currencyPair: pair
        };
        // Adiciona o novo sinal ao final do array existente
        this.signals.push(robotSignal);
      });
    });
  }
  

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    clearInterval(this.updateInterval);
  }
}