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
          const prices = Object.values(timeSeries).map((entry: any) => parseFloat(entry['4. close'])).slice(0, 7);

          const rsi = this.utilService.calculateRSI(prices);
          const priceChange = ((prices[0] - prices[6]) / prices[6]) * 100;

          if (Math.abs(priceChange) > 2) {  // Limiar de 2%
            observer.next(priceChange > 0 ? 'Sinal de Venda baseado no preço' : 'Sinal de Compra baseado no preço');
          } else {
            if (rsi > 70) {
              observer.next('Sinal de Venda baseado no RSI');
            } else if (rsi < 30) {
              observer.next('Sinal de Compra baseado no RSI');
            } else {
              observer.next('Sem sinal');
            }
          }
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
