import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { CurrencyPairService } from './currency-pair.service';
import { DecisionService } from './decision.service';
import { Observable, interval, combineLatest, from, of, BehaviorSubject } from 'rxjs';
import { switchMap, filter, map } from 'rxjs/operators';
import { APIResponse, TimeSeries } from '../models/api.interfaces';

@Injectable({
  providedIn: 'root'
})
export class RoboService {
  private lastDecisions: { [currencyPair: string]: string } = {};

  private decisionSubject = new BehaviorSubject<{ decision: string, currencyPair: string } | null>(null);
  public decision$ = this.decisionSubject.asObservable();

  constructor(
    private apiService: ApiService,
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

        return from(currencyPairs).pipe(
          switchMap(symbol => this.fetchAndDecide(symbol))
        );
      })
    )
    .subscribe(({ symbol, decision }) => {
      if (this.lastDecisions[symbol] !== decision) {
        console.log('Decisão alterada:', decision);
        
        this.decisionSubject.next({ decision, currencyPair: symbol });
        
        this.lastDecisions[symbol] = decision;
      } else {
        console.log('Decisão inalterada:', decision);
      }
    });
  }

  private fetchAndDecide(symbol: string): Observable<{ symbol: string, decision: string }> {
    return this.apiService.getData(symbol, '5min').pipe(
      switchMap(data5min => {
        const timeSeries5min = this.extractPrices(data5min['Time Series (5min)'], 14);
        return this.apiService.getData(symbol, '15min').pipe(
          switchMap(data15min => {
            const timeSeries15min = this.extractPrices(data15min['Time Series (15min)'], 14);
            return this.apiService.getData(symbol, '1h').pipe(
              map(data1h => {
                const timeSeries1h = this.extractPrices(data1h['Time Series (1h)'], 14);
                return {
                  symbol,
                  decision: this.decisionService.makeDecision(timeSeries5min, timeSeries15min, timeSeries1h)
                };
              })
            );
          })
        );
      })
    );
  }

  private extractPrices(timeSeries: TimeSeries, points: number): number[] {
    return Object.values(timeSeries)
      .map(entry => parseFloat(entry['4. close']))
      .slice(0, points);
  }
}
