import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoboService } from '../../services/robo.service';
import { CurrencyPairService } from '../../services/currency-pair.service';
import { ApiService } from '../../services/api.service';

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
  private lastDecisions: { [currencyPair: string]: string } = {};
  private updateIntervalId: any;

  constructor(
    private roboService: RoboService,
    private currencyPairService: CurrencyPairService,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef  // Injete o ChangeDetectorRef aqui
  ) {}

  ngOnInit(): void {
    this.performHealthCheck();
    this.subscribeToCurrencyPairs();
    this.setUpdateInterval();
  }

  private performHealthCheck(): void {
    this.apiService.healthCheck().subscribe(
      data => console.log('API is working', data),
      error => console.log('API is not working', error)
    );
  }

  private subscribeToCurrencyPairs(): void {
    const currencyPairSubscription = this.currencyPairService.currencyPairs$.subscribe(pairs => {
      this.updateSignals(pairs);
    });
    this.subscriptions.push(currencyPairSubscription);
  }

  private setUpdateInterval(): void {
    this.updateIntervalId = setInterval(() => {
      this.updateSignals(this.currencyPairService.currencyPairs$.getValue());
    }, 300000);
  }

  private updateSignals(pairs: string[]): void {
    console.log('Novos pares de moedas:', pairs);
    pairs.forEach(pair => {
      this.roboService.decideAcao(pair).subscribe(signal => {
        if (this.lastDecisions[pair] !== signal) {
          const robotSignal: RobotSignal = {
            time: new Date().toLocaleTimeString(),
            action: signal,
            currencyPair: pair
          };
          this.signals.unshift(robotSignal);
          this.lastDecisions[pair] = signal; // Atualize a última decisão para este par de moedas
  
          // Marque o componente para detecção de mudanças imediatas
          this.cdr.detectChanges();
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    clearInterval(this.updateIntervalId);
  }
}
