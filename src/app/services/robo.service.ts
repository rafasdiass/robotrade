import { Injectable } from '@angular/core';
import { DecisionService } from './decision.service';
import { CurrencyPairService } from './currency-pair.service';
import { Observable, interval, combineLatest } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoboService {
  private lastDecisions: { [currencyPair: string]: string } = {};

  private decisionSubject = new BehaviorSubject<{ decision: string, currencyPair: string } | null>(null);
  public decision$ = this.decisionSubject.asObservable();

  constructor(
    private decisionService: DecisionService,
    private currencyPairService: CurrencyPairService
  ) {
    this.observeData();
  }

  private observeData(): void {
    const fiveMinuteInterval$ = interval(300000);

    combineLatest([
      fiveMinuteInterval$,
      this.currencyPairService.currencyPairs$
    ])
    .pipe(
      switchMap(([_, currencyPairs]) => {
        if (!currencyPairs.length) {
          console.log("Nenhum par de moeda disponível para análise.");
          return [];
        }

        return combineLatest([
          this.currencyPairService.closingPrices5min$,
          this.currencyPairService.closingPrices15min$,
          this.currencyPairService.closingPrices1h$
        ]).pipe(
          tap(([closingPrices5min, closingPrices15min, closingPrices1h]) => {
            currencyPairs.forEach(pair => {
              const decision = this.decisionService.makeDecision(pair, closingPrices5min, closingPrices15min, closingPrices1h);

              if (this.lastDecisions[pair] !== decision) {
                console.log(`Decisão alterada para ${pair}: ${decision}`);
                this.decisionSubject.next({ decision, currencyPair: pair });
                this.lastDecisions[pair] = decision;
                console.log(`A decisão atual do robô para ${pair} é ${decision}`);
              } else {
                console.log(`Decisão inalterada para ${pair}: ${decision}`);
                console.log(`A decisão atual do robô para ${pair} ainda é ${decision}`);
              }
            });
          })
        );
      })
    )
    .subscribe(
      () => {}, // A lógica foi movida para o operador 'tap'
      error => {
        console.error("Erro ao processar os dados:", error);
      }
    );
  }
}
