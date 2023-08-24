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
      this.apiService.getStockData(symbol).subscribe((data: any) => {
        if (data && data['Time Series (5min)']) {
          const timeSeries = data['Time Series (5min)'];
          const prices = Object.values(timeSeries).map((entry: any) => parseFloat(entry['4. close'])).slice(0, 9);

          const rsi = this.utilService.calculateRSI(prices);
          const ema9 = this.utilService.calculateEMA(prices, 9);
          const priceChange = this.utilService.calculatePriceChange(prices);

          let decision = 'Sem sinal';

          if (Math.abs(priceChange) > 2) {
            decision = 'Venda';
            console.log('Sinal de Venda baseado no preço');
          } else if (rsi > 70) {
            decision = 'Venda';
            console.log('Sinal de Venda baseado no RSI');
          } else if (rsi < 30) {
            decision = 'Compra';
            console.log('Sinal de Compra baseado no RSI');
          }

          // Lógica para EMA de 9 períodos
          if (prices[1] > ema9 && prices[2] > ema9 && prices[0] < ema9) {
            decision = 'Venda';
            console.log('Sinal de Venda baseado na EMA');
          } else if (prices[1] < ema9 && prices[2] < ema9 && prices[0] > ema9) {
            decision = 'Compra';
            console.log('Sinal de Compra baseado na EMA');
          }

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
