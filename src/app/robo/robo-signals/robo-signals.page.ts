import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoboService } from '../../services/robo.service';
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

  // Declare as novas propriedades aqui
  public isLoading: boolean = false;
  public apiError: boolean = false;

  constructor(
    private roboService: RoboService,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.performHealthCheck();
    this.subscribeToRoboDecisions();
  }

  private performHealthCheck(): void {
    this.apiService.healthCheck().subscribe(
      data => {
        console.log('API is working', data);
        console.log('Validando os dados: ', JSON.stringify(data, null, 2));
      },
      error => {
        console.log('API is not working', error);
        this.apiError = true; // atualize o estado se a API não estiver funcionando
      }
    );
  }

  private subscribeToRoboDecisions(): void {
    const roboDecisionSubscription = this.roboService.decision$.subscribe(data => {
      if (data) {
        const { decision, currencyPair } = data;
        console.log(`Recebido: ${currencyPair} - ${decision}`);
  
        if (this.lastDecisions[currencyPair] !== decision) {
          const newSignal: RobotSignal = {
            time: new Date().toLocaleTimeString(),
            action: decision,
            currencyPair
          };
          this.signals = [newSignal, ...this.signals];
          this.lastDecisions[currencyPair] = decision;
        }
      }
    });
  
    this.subscriptions.push(roboDecisionSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
