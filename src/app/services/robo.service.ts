import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { UtilService } from './util.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoboService {

  constructor(private apiService: ApiService, private utilService: UtilService) {}

  decideAcao(symbol: string): Observable<string> {
    return new Observable(observer => {
      this.apiService.getStockData(symbol).subscribe(data => {
        if (data && data['Time Series (5min)']) {
          const timeSeries = data['Time Series (5min)'];
          const prices = Object.values(timeSeries).map((entry: any) => parseFloat(entry['4. close'])).slice(0, 7);

          const rsi = this.utilService.calculateRSI(prices);

          if (rsi > 70) {
            observer.next('Sinal de Venda');
          } else if (rsi < 30) {
            observer.next('Sinal de Compra');
          } else {
            observer.next('Sem sinal');
          }
          observer.complete();
        }
      });
    });
  }
}
