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
    this.currencyPairs$.next(['USDJPY', 'EURUSD', 'EURJPY', 'EURCAD']);
    this.updateCurrencyPairs();
  }

  updateCurrencyPairs(): void {
    this.apiService.getListOfCurrencies().subscribe(data => {
      console.log('Dados brutos da API:', data);  // Log para depuração
  
      if (data && data['Time Series (5min)']) {
        const currencyPairs = Object.keys(data['Time Series (5min)'])
          .filter((symbol: string) => /EUR|USD|JPY|CAD/.test(symbol))
          .slice(0, 5);
  
        console.log('Pares de moedas filtrados:', currencyPairs);  // Log para depuração
  
        if (currencyPairs.length > 0) {
          this.currencyPairs$.next(currencyPairs);
        } else {
          console.log('Nenhum par de moedas correspondente encontrado.');  // Log para depuração
        }
      } else {
        console.log('Dados da API inválidos ou ausentes.');  // Log para depuração
      }
    });
  }

  decideAcaoParMoeda(pair: string) {
    this.apiService.getCandleData(pair).subscribe(data => {
      if (data && data['Time Series (5min)']) {
        const timeSeries = data['Time Series (5min)'];
        const prices = Object.values(timeSeries).map((entry: any) => parseFloat(entry['4. close'])).slice(0, 9);

        const rsi = this.utilService.calculateRSI(prices);
        const ema9 = this.utilService.calculateEMA(prices);

        let decision = 'Sem sinal';

        if (rsi > 70) {
          decision = `Sinal de Venda para ${pair} baseado no RSI`;
        } else if (rsi < 30) {
          decision = `Sinal de Compra para ${pair} baseado no RSI`;
        }

        // Lógica para EMA de 9 períodos
        if (prices[1] > ema9 && prices[2] > ema9 && prices[0] < ema9) {
          decision = `Sinal de Venda para ${pair} baseado na EMA`;
        } else if (prices[1] < ema9 && prices[2] < ema9 && prices[0] > ema9) {
          decision = `Sinal de Compra para ${pair} baseado na EMA`;
        }

        console.log(decision);
      } else {
        console.log(`Dados insuficientes para decisão sobre ${pair}`);
      }
    });
  }
}
