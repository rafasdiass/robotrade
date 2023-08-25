import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { UtilService } from './util.service';
import { APIResponse, TimeSeries } from '../models/api.interfaces'; 

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
    this.apiService.getAllCurrencyPairs().subscribe(
      (response: APIResponse) => {
        if (response && response.allPairs && Array.isArray(response.allPairs)) {
          const allPairs: string[] = response.allPairs;
          const filteredPairs = allPairs.filter(pair => /EUR|USD|JPY|AUD|CAD/.test(pair));
          
          if (filteredPairs.length > 0) {
            this.currencyPairs$.next(filteredPairs);
          } else {
            console.log('Nenhum par de moedas correspondente encontrado.');
          }
        } else {
          console.log('Dados da API inválidos ou ausentes.');
        }
      },
      error => {
        console.log('Erro ao buscar dados da API:', error);
      }
    );
  }
}
