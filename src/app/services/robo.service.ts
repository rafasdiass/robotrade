import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UtilService } from './util.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoboService {

  constructor(private apiService: ApiService, private utilService: UtilService) {}

  decideAcao(symbol: string): Observable<string> {
    return new Observable(observer => {
      this.apiService.getCandleData(symbol, '5min').subscribe(data5min => {
        if (data5min && data5min['Time Series (5min)']) {
          const timeSeries5min = data5min['Time Series (5min)'];
          const prices5min = Object.values(timeSeries5min).map((entry: any) => parseFloat(entry['4. close'])).slice(0, 14);

          const rsi = this.utilService.calculateRSI(prices5min);
          const ema = this.utilService.calculateEMA(prices5min);
          const priceChange = this.utilService.calculatePriceChange(prices5min);
          const stochasticOscillator = this.utilService.calculateStochasticOscillator(prices5min);
          const fibonacciLevels = this.utilService.calculateFibonacciLevels(Math.min(...prices5min), Math.max(...prices5min));

          let score = 0;

          // RSI strategy
          if (rsi < 30) score++;
          else if (rsi > 70) score--;

          // EMA strategy
          if (prices5min[0] > ema) score++;
          else if (prices5min[0] < ema) score--;

          // Price Change strategy
          if (priceChange > 0) score++;
          else if (priceChange < 0) score--;

          // Stochastic Oscillator strategy
          if (stochasticOscillator < 20) score++;
          else if (stochasticOscillator > 80) score--;

          // Fibonacci Levels strategy (just an example, can be refined)
          if (prices5min[0] > fibonacciLevels['61.8%'] && prices5min[0] < fibonacciLevels['100.0%']) score++;

          let decision = 'Sem sinal';
          if (score > 0) decision = 'Compra';
          else if (score < 0) decision = 'Venda';

          observer.next(decision);
          observer.complete();
        } else {
          observer.next('Dados insuficientes para decisão');
          observer.complete();
        }
      }, (error: any) => {
        observer.next('Erro ao acessar os dados da API');
        observer.complete();
      });
    });
  }
}
