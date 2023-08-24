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
    // Inicializa com pares de moedas pré-definidos
    this.currencyPairs$.next(['USDJPY', 'EURUSD', 'EURJPY', 'EURCAD']);
    
    // Chama updateCurrencyPairs para atualizar com base na API, se necessário
    this.updateCurrencyPairs();
  }

  updateCurrencyPairs(): void {
    this.apiService.getListOfCurrencies().subscribe(data => {
      console.log('Dados brutos da API:', data);  // Log para depuração
  
      if (data && data['bestMatches']) {
        console.log('Matches brutos:', data['bestMatches']);  // Log adicional para depuração
  
        const currencyPairs = data['bestMatches']
          .map((match: any) => match['1. symbol'])
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
