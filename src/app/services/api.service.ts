import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { APIResponse, TimeSeries, TimeSeriesEntry, CurrencyExchangeRate, FibonacciLevels } from '../models/api.interfaces';
import { CurrencyPairService } from './currency-pair.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiEnv.baseUrl;
  private readonly apiKey = environment.apiEnv.apiKey;

  // Definindo um valor padrão para APIResponse
  private readonly defaultAPIResponse: APIResponse = {
    'Time Series (5min)': {},
    'Time Series (15min)': {},
    'Time Series (1h)': {},
    allPairs: []
  };

  constructor(private readonly http: HttpClient, private readonly currencyPairService: CurrencyPairService) { }

  public healthCheck(): Observable<APIResponse> {
    return this.currencyPairService.currencyPairs$.pipe(
      switchMap((pairs: string[]) => {
        const defaultPair = pairs[0];
        return defaultPair ? this.fetchTimeSeriesData(defaultPair, '5min') : of(this.defaultAPIResponse);
      })
    );
  }

  private fetchTimeSeriesData(symbol: string, interval: string): Observable<APIResponse> {
    const url = `${this.baseUrl}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${this.apiKey}`;
    return this.http.get<APIResponse>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(error);
  }

  public getListOfCurrencies(): Observable<APIResponse> {  
    // Note: This function does not seem to match its implementation. You may want to correct this.
    return this.fetchTimeSeriesData('USD', 'EUR');
  }

  public getData(symbol: string, interval: string): Observable<APIResponse> {
    return this.fetchTimeSeriesData(symbol, interval);
  }

  public get5MinData(symbol: string): Observable<APIResponse> {
    return this.getData(symbol, '5min');
  }

  public get15MinData(symbol: string): Observable<APIResponse> {
    return this.getData(symbol, '15min');
  }

  public get1hData(symbol: string): Observable<APIResponse> {
    return this.getData(symbol, '60min');
  }
}
