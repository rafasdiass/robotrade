import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { APIResponse, TimeSeries, TimeSeriesEntry } from '../models/api.interfaces';

@Injectable({
  providedIn: 'root'
})
export class CurrencyPairService {
  public currencyPairs$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public closingPrices5min$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  public closingPrices15min$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  public closingPrices1h$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

  constructor(private apiService: ApiService) {
    this.updateCurrencyPairs();
  }

  updateCurrencyPairs(): void {
    this.apiService.getAllCurrencyPairs().subscribe(
      (responses: APIResponse[]) => {
        const allPairs: string[] = [];
        responses.forEach(response => {
          const keys = Object.keys(response);
          keys.forEach(pair => {
            if (/EUR|USD|JPY|AUD|CAD/.test(pair)) {
              allPairs.push(pair);
            }
          });
        });
        this.currencyPairs$.next(allPairs);
      },
      error => {
        console.log('Erro ao buscar dados da API:', error);
      }
    );
  }

  calculateFibonacciLevels(low: number, high: number): number[] {
    const fiboLevels = [0.382, 0.5, 0.618];
    return fiboLevels.map(level => low + (high - low) * level);
  }

  fetchPriceData(ref: string, interval: string): void {
    this.apiService.getData(ref, interval).subscribe(
      (response: APIResponse) => {
        const key = `Time Series (${interval})`;
        if (response && key in response) {  // Guarda de tipo
          const timeSeries: TimeSeries = (response as any)[key];  // Type casting
          const closingPrices: number[] = Object.values(timeSeries).map((entry: TimeSeriesEntry) => parseFloat(entry['4. close']));
          if (interval === '5min') this.closingPrices5min$.next(closingPrices);
          if (interval === '15min') this.closingPrices15min$.next(closingPrices);
          if (interval === '1h') this.closingPrices1h$.next(closingPrices);
        }
      },
      error => {
        console.log(`Erro ao buscar dados de ${interval}:`, error);
      }
    );
  }

  fetch5MinData(ref: string): void {
    this.fetchPriceData(ref, '5min');
  }

  fetch15MinData(ref: string): void {
    this.fetchPriceData(ref, '15min');
  }

  fetch1hData(ref: string): void {
    this.fetchPriceData(ref, '1h');
  }
}
