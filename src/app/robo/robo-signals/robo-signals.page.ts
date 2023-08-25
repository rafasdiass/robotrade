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
  
        // Obter todos os pares de moedas atuais
        const currentCurrencyPairs = this.currencyPairService.currencyPairs$.getValue();
  
        // Atualizar a interface do usuário para cada par de moedas
        currentCurrencyPairs.forEach(pair => {
          if (this.lastDecisions[pair] !== decision) {
            // Criar um novo sinal de robô com a decisão atualizada
            const newSignal: RobotSignal = {
              time: new Date().toLocaleTimeString(),
              action: decision,
              currencyPair: pair
            };
  
            // Adicionar o novo sinal ao início do array de sinais
            this.signals.unshift(newSignal);
  
            // Atualizar a última decisão para o par de moedas atual
            this.lastDecisions[pair] = decision;
  
            // Forçar a detecção de mudanças para atualizar a UI
            this.cdr.detectChanges();
          }
        });
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
