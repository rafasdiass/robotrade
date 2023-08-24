import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UtilService } from './util.service';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoboService {

  constructor(private apiService: ApiService, private utilService: UtilService) {}

  decideAcao(symbol: string): Observable<string> {
    return new Observable(observer => {
      forkJoin([
        this.apiService.getCandleData(symbol, '5min'),
        this.apiService.getCandleData(symbol, '15min')
      ]).subscribe(([data5min, data15min]) => {
        if (data5min && data5min['Time Series (5min)'] && data15min && data15min['Time Series (15min)']) {
          const timeSeries5min = data5min['Time Series (5min)'];
          const prices5min = Object.values(timeSeries5min).map((entry: any) => parseFloat(entry['4. close'])).slice(0, 14);

          const timeSeries15min = data15min['Time Series (15min)'];
          const prices15min = Object.values(timeSeries15min).map((entry: any) => parseFloat(entry['4. close'])).slice(0, 14);

          const rsi5min = this.utilService.calculateRSI(prices5min);
          const rsi15min = this.utilService.calculateRSI(prices15min);

          let decision = 'Sem sinal';

          if (rsi5min > 70 && rsi15min > 70) {
            decision = 'Venda';
            console.log('Sinal de Venda baseado nos gráficos de 5min e 15min');
          } else if (rsi5min < 30 && rsi15min < 30) {
            decision = 'Compra';
            console.log('Sinal de Compra baseado nos gráficos de 5min e 15min');
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
