import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { APIResponse, TimeSeries, TimeSeriesEntry } from '../models/api.interfaces';

@Injectable({
  providedIn: 'root'
})
export class CurrencyPairService {

  private readonly currencyPairs: string[] = ['EURUSD', 'AUDCAD'];
  public currencyPairs$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(this.currencyPairs);
  public closingPrices5min$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  public closingPrices15min$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  public closingPrices1h$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

  constructor(private apiService: ApiService) {
    console.log('Iniciando serviço de pares de moedas...');
    console.log(`Pares de moedas setados: ${this.currencyPairs.join(', ')}`);
    
    // Chamar a API para cada par de moedas especificado
    this.currencyPairs.forEach(pair => {
      this.fetchPriceData(pair, '5min');
      this.fetchPriceData(pair, '15min');
      this.fetchPriceData(pair, '1h');
    });
  }

  public calculateFibonacciLevels(low: number, high: number): number[] {
    const fiboLevels = [0.382, 0.5, 0.618];
    return fiboLevels.map(level => low + (high - low) * level);
  }

  public fetchPriceData(ref: string, interval: string): void {
    console.log(`Buscando dados de preço para ${ref} no intervalo ${interval}...`);
    // Atualizado para usar fetchTimeSeriesData
    this.apiService.fetchTimeSeriesData(ref, interval).subscribe(
      (response: APIResponse) => this.processPriceDataResponse(response, interval),
      error => console.log(`Erro ao buscar dados de ${interval}:`, error)
    );
  }

  private processPriceDataResponse(response: APIResponse, interval: string): void {
    const key = `Time Series (${interval})`;
    if (response && key in response) {
      const timeSeries: TimeSeries = (response as any)[key];
      const closingPrices = this.extractClosingPrices(timeSeries);
      this.updateClosingPrices(interval, closingPrices);
    }
  }

  private extractClosingPrices(timeSeries: TimeSeries): number[] {
    return Object.values(timeSeries).map((entry: TimeSeriesEntry) => parseFloat(entry['4. close']));
  }

  private updateClosingPrices(interval: string, closingPrices: number[]): void {
    if (interval === '5min') this.closingPrices5min$.next(closingPrices);
    if (interval === '15min') this.closingPrices15min$.next(closingPrices);
    if (interval === '1h') this.closingPrices1h$.next(closingPrices);
  }
}
