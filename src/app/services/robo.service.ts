import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UtilService } from './util.service';
import { CurrencyPairService } from './currency-pair.service';
import { Observable, interval, combineLatest, from, of } from 'rxjs'; 
import { switchMap, filter, map } from 'rxjs/operators';
import { APIResponse, TimeSeries, FibonacciLevels } from '../models/api.interfaces'; 

@Injectable({
  providedIn: 'root'
})
export class RoboService {
  private readonly BUY = 'Compra';
  private readonly SELL = 'Venda';
  private readonly NO_SIGNAL = 'Sem sinal';
  private lastDecisions: { [currencyPair: string]: string } = {}; // Objeto para armazenar a última decisão para cada par de moedas

  constructor(
    private apiService: ApiService,
    private utilService: UtilService,
    private currencyPairService: CurrencyPairService
  ) {
    // Iniciar o intervalo de 5 minutos
    const fiveMinuteInterval$ = interval(300000);

    // Observar mudanças
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
            map(decision => ({ symbol, decision }))  // Mapeie a decisão e o símbolo juntos
          );
        }
        return of({ symbol: 'Tipo de dado inválido', decision: 'Tipo de dado inválido' });
      })
    );
  })
)
.subscribe(({ symbol, decision }) => {  // Desestruture o objeto para obter símbolo e decisão
  if (this.lastDecisions[symbol] !== decision) { // Verifique se a decisão mudou para este par de moedas
    console.log('Decisão alterada:', decision);
    this.lastDecisions[symbol] = decision; // Atualize a última decisão para este par de moedas
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
          const decision = this.makeDecision(prices);
          observer.next(decision);
        } else {
          observer.next(this.NO_SIGNAL);
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

  private makeDecision(prices: number[]): string {
    const rsi = this.utilService.calculateRSI(prices);
    const ema = this.utilService.calculateEMA(prices);
    const priceChange = this.utilService.calculatePriceChange(prices);
    const stochasticOscillator = this.utilService.calculateStochasticOscillator(prices);
    const fibonacciLevels: FibonacciLevels = this.utilService.calculateFibonacciLevels(Math.min(...prices), Math.max(...prices));

    let score = 0;

    score += this.applyRSIStrategy(rsi);
    score += this.applyEMAStrategy(prices[0], ema);
    score += this.applyPriceChangeStrategy(priceChange);
    score += this.applyStochasticOscillatorStrategy(stochasticOscillator);
    score += this.applyFibonacciLevelsStrategy(prices[0], fibonacciLevels);

    return score > 0 ? this.BUY : score < 0 ? this.SELL : this.NO_SIGNAL;
  }

  private applyRSIStrategy(rsi: number): number {
    return rsi < 30 ? 1 : rsi > 70 ? -1 : 0;
  }

  private applyEMAStrategy(price: number, ema: number): number {
    return price > ema ? 1 : price < ema ? -1 : 0;
  }

  private applyPriceChangeStrategy(priceChange: number): number {
    return priceChange > 0 ? 1 : priceChange < 0 ? -1 : 0;
  }

  private applyStochasticOscillatorStrategy(stochasticOscillator: number): number {
    return stochasticOscillator < 20 ? 1 : stochasticOscillator > 80 ? -1 : 0;
  }

  private applyFibonacciLevelsStrategy(price: number, fibonacciLevels: FibonacciLevels): number {
    return (price > fibonacciLevels['61.8%'] && price < fibonacciLevels['100.0%']) ? 1 : 0;
  }
}