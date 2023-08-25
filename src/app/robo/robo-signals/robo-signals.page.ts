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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.performHealthCheck();
    this.subscribeToCurrencyPairs();
    this.setUpdateInterval();
    this.subscribeToRoboDecisions(); 
  }

  private performHealthCheck(): void {
    this.apiService.healthCheck().subscribe(
      data => console.log('API is working', data),
      error => console.log('API is not working', error)
    );
  }

  private subscribeToRoboDecisions(): void {
    const roboDecisionSubscription = this.roboService.decision$.subscribe(decision => {
      if (decision) {
        console.log('Decisão atualizada via BehaviorSubject:', decision);
        // Aqui você pode fazer algo com a decisão atualizada
      }
    });
    this.subscriptions.push(roboDecisionSubscription);
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
            currencyPair: pair  // Ajustado para usar o par de moedas atual
          };
          this.signals.unshift(robotSignal);
          this.lastDecisions[pair] = signal;
  
          // Forçar a detecção de mudanças
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
