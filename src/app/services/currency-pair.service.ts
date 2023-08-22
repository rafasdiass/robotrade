import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyPairService {
  // Inicializando com os pares de moedas especificados
  public currencyPairs$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(['EURUSD', 'USDJPY', 'EURCAD', 'EURJPY', 'CADJPY']);

  constructor(private apiService: ApiService) {
    this.updateCurrencyPairs();
  }

  updateCurrencyPairs(): void {
    this.apiService.getListOfCurrencies().subscribe(data => {
      if (data && data['bestMatches']) {
        const currencyPairs = data['bestMatches']
          .map((match: any) => match['1. symbol'])
          .filter((symbol: string) => /EUR|USD|JPY|CAD/.test(symbol));

        // Adicionando os pares de moedas especificados diretamente
        const predefinedPairs = ['EURUSD', 'USDJPY', 'EURCAD', 'EURJPY', 'CADJPY'];
        predefinedPairs.forEach(pair => {
          if (!currencyPairs.includes(pair)) {
            currencyPairs.push(pair);
          }
        });

        this.currencyPairs$.next(currencyPairs);
      }
    });
  }
}
