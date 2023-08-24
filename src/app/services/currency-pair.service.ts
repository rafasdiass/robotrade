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
    this.apiService.getListOfCurrencies().subscribe((data: APIResponse) => { 
      console.log('Dados brutos da API:', data);
  
      const timeSeries: TimeSeries | undefined = data?.['Time Series (5min)']; 
      if (timeSeries) {
        const currencyPairs = Object.keys(timeSeries)
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
}
