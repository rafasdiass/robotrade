// currency-pair.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { UtilService } from './util.service';
import { APIResponse, TimeSeries, TimeSeriesEntry } from '../models/api.interfaces';

@Injectable({
  providedIn: 'root'
})
export class CurrencyPairService {
  public currencyPairs$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(['USDJPY', 'EURUSD', 'EURJPY', 'EURCAD', 'AUDUSD', 'NZDJPY', 'AUDUSD', 'AUDCAD']);
  public closingPrices5min$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  public closingPrices15min$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  public closingPrices1h$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]); // Novo BehaviorSubject para preços de 1 hora

  constructor(private apiService: ApiService, private utilService: UtilService) {
    this.updateCurrencyPairs();
  }

  updateCurrencyPairs(): void {
    this.apiService.getAllCurrencyPairs().subscribe(
      response => {
        if (response && response.allPairs) {
          const filteredPairs = response.allPairs.filter(pair => /EUR|USD|JPY|AUD|CAD/.test(pair));
          this.currencyPairs$.next(filteredPairs);
        }
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

  fetch5MinData(ref: string): void {
    this.apiService.get5MinData(ref).subscribe(
      response => {
        if (response && response['Time Series (5min)']) {
          const timeSeries: TimeSeries = response['Time Series (5min)'];
          const closingPrices: number[] = Object.values(timeSeries).map(entry => parseFloat(entry['4. close']));
          this.closingPrices5min$.next(closingPrices);
        }
      },
      error => {
        console.log('Erro ao buscar dados de 5 minutos:', error);
      }
    );
  }

  fetch15MinData(ref: string): void {
    this.apiService.get15MinData(ref).subscribe(
      response => {
        if (response && response['Time Series (15min)']) {
          const timeSeries: TimeSeries = response['Time Series (15min)'];
          const closingPrices: number[] = Object.values(timeSeries).map(entry => parseFloat(entry['4. close']));
          this.closingPrices15min$.next(closingPrices);
        }
      },
      error => {
        console.log('Erro ao buscar dados de 15 minutos:', error);
      }
    );
  }

  fetch1hData(ref: string): void { // Novo método para buscar dados de 1 hora
    this.apiService.get1hData(ref).subscribe(
      response => {
        if (response && response['Time Series (1h)']) {
          const timeSeries: TimeSeries = response['Time Series (1h)'];
          const closingPrices: number[] = Object.values(timeSeries).map(entry => parseFloat(entry['4. close']));
          this.closingPrices1h$.next(closingPrices);
        }
      },
      error => {
        console.log('Erro ao buscar dados de 1 hora:', error);
      }
    );
  }
}
