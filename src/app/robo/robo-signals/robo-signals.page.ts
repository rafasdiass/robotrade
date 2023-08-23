import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoboService } from '../../services/robo.service';
import { CurrencyPairService } from '../../services/currency-pair.service';

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

  constructor(private roboService: RoboService, private currencyPairService: CurrencyPairService) {}

  ngOnInit() {
    // Subscreva aos pares de moedas atualizados
    const currencyPairSubscription = this.currencyPairService.currencyPairs$.subscribe(pairs => {
      pairs.forEach(pair => {
        // Para cada par de moedas, obtenha um sinal de ação
        this.roboService.decideAcao(pair).subscribe(signal => {
          const robotSignal: RobotSignal = {
            time: new Date().toLocaleTimeString(),
            action: signal,
            currencyPair: pair
          };
          this.signals.push(robotSignal);
        });
      });
    });

    this.subscriptions.push(currencyPairSubscription);
  }

  ngOnDestroy() {
    // Cancele todas as inscrições quando o componente for destruído
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
