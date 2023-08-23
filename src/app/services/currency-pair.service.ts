import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyPairService {
  public currencyPairs$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(private apiService: ApiService, private utilService: UtilService) {
    this.updateCurrencyPairs();
  }

  updateCurrencyPairs(): void {
    this.apiService.getListOfCurrencies().subscribe(data => {
      if (data && data['bestMatches']) {
        const currencyPairs = data['bestMatches']
          .map((match: any) => match['1. symbol'])
          .filter((symbol: string) => /EUR|USD|JPY|CAD/.test(symbol))
          .slice(0, 5);

        this.currencyPairs$.next(currencyPairs);
      }
    });
  }

  decideAcaoParMoeda(pair: string) {
    this.apiService.getCandleData(pair).subscribe(data => {
      if (data && data['Time Series (5min)']) {
        const timeSeries = data['Time Series (5min)'];
        const prices = Object.values(timeSeries).map((entry: any) => parseFloat(entry['4. close'])).slice(0, 7);

        const rsi = this.utilService.calculateRSI(prices);

        if (rsi > 70) {
          console.log(`Sinal de Venda para ${pair}`);
        } else if (rsi < 30) {
          console.log(`Sinal de Compra para ${pair}`);
        } else {
          console.log(`Sem sinal para ${pair}`);
        }
      }
    });
  }
}
