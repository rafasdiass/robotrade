import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UtilService } from './util.service';
import { Observable } from 'rxjs';
import { APIResponse, TimeSeries, FibonacciLevels } from '../models/api.interfaces'; 

@Injectable({
  providedIn: 'root'
})
export class RoboService {
  private readonly BUY = 'Compra';
  private readonly SELL = 'Venda';
  private readonly NO_SIGNAL = 'Sem sinal';

  constructor(private apiService: ApiService, private utilService: UtilService) {}

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
  
    // RSI strategy
    score += this.applyRSIStrategy(rsi);

    // EMA strategy
    score += this.applyEMAStrategy(prices[0], ema);

    // Price Change strategy
    score += this.applyPriceChangeStrategy(priceChange);

    // Stochastic Oscillator strategy
    score += this.applyStochasticOscillatorStrategy(stochasticOscillator);

    // Fibonacci Levels strategy
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
