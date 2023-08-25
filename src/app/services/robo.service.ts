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
  private decisionSubject = new BehaviorSubject<string | null>(null);
  public decision$ = this.decisionSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private decisionService: DecisionService,  // Novo serviço injetado
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
      filter(() => new Date().getSeconds() <= 45),
      switchMap(([_, currencyPairs]) => {
        return from(currencyPairs).pipe(
          switchMap(symbol => {
            if (typeof symbol === 'string') {
              return this.decideAcao(symbol).pipe(
                map(decision => ({ symbol, decision }))
              );
            }
            return of({ symbol: 'Tipo de dado inválido', decision: 'Tipo de dado inválido' });
          })
        );
      })
    )
    .subscribe(({ symbol, decision }) => {
      if (this.lastDecisions[symbol] !== decision) {
        console.log('Decisão alterada:', decision);
        this.lastDecisions[symbol] = decision;
      } else {
        console.log('Decisão inalterada:', decision);
      }
    });
  }

  decideAcao(symbol: string): Observable<string> {
    return new Observable(observer => {
      this.apiService.getData(symbol).subscribe((data: APIResponse) => {
        const timeSeries: TimeSeries | undefined = data?.['Time Series (5min)'];
        if (timeSeries) {
          const prices = this.extractPrices(timeSeries);
          const decision = this.decisionService.makeDecision(prices);  
          this.decisionSubject.next(decision);  
          observer.next(decision);
        } else {
          observer.next('Sem sinal');
        }
        observer.complete();
      }, error => {
        observer.next('Erro ao acessar os dados da API');
        observer.complete();
      });
    });
  }

  private extractPrices(timeSeries: TimeSeries): number[] {
    return Object.values(timeSeries)
      .map(entry => parseFloat(entry['4. close']))
      .slice(0, 14);
  }
}
