import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { ApiService } from './api.service';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyPairService {
  public currencyPairs$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(private apiService: ApiService, private utilService: UtilService) {
    this.currencyPairs$.next(['USDJPY', 'EURUSD', 'EURJPY', 'EURCAD', 'AUDUSD', 'NZDJPY', 'AUDUSD', 'AUDCAD']);
    this.updateCurrencyPairs();
  }

  calculateFibonacciLevels(low: number, high: number): number[] {
    const fiboLevels = [0.382, 0.5, 0.618];
    return fiboLevels.map(level => low + (high - low) * level);
  }

  updateCurrencyPairs(): void {
    this.apiService.getListOfCurrencies().subscribe(data => {
      console.log('Dados brutos da API:', data);
  
      if (data && data['Time Series (5min)']) {
        const currencyPairs = Object.keys(data['Time Series (5min)'])
          .filter((symbol: string) => /EUR|USD|JPY|AUD|CAD/.test(symbol))
          .slice(0, 5);
  
        console.log('Pares de moedas filtrados:', currencyPairs);
  
        if (currencyPairs.length > 0) {
          this.currencyPairs$.next(currencyPairs);
        } else {
          console.log('Nenhum par de moedas correspondente encontrado.');
        }
      } else {
        console.log('Dados da API inválidos ou ausentes.');
      }
    });
  }

  decideAcaoParMoeda(pair: string) {
    forkJoin([
      this.apiService.getCandleData(pair, '5min'),
      this.apiService.getCandleData(pair, '15min')
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
          decision = `Venda para ${pair}`;
        } else if (rsi5min < 30 && rsi15min < 30) {
          decision = `Compra para ${pair}`;
        }

        console.log(`Decisão para ${pair}: ${decision}`);
      } else {
        console.log(`Dados insuficientes para decisão sobre ${pair}`);
      }
    });
  }
}
