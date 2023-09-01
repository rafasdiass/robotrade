import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { APIResponse, TimeSeries, TimeSeriesEntry } from '../models/api.interfaces';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.baseUrl;
  private apiKey = environment.apiKey; 

  constructor(private http: HttpClient) { }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(error);
  }

  private mountAlphaVantageURL(functionType: string, symbol: string, interval: string): string {
    return `${this.baseUrl}?function=${functionType}&symbol=${symbol}&interval=${interval}&apikey=${this.apiKey}`;
  }

  private mountGETRequest(url: string): Observable<APIResponse> {
    return this.http.get<APIResponse>(url).pipe(
      catchError(this.handleError)
    );
  }

  healthCheck(): Observable<APIResponse> {  
    return this.mountGETRequest(this.mountAlphaVantageURL('TIME_SERIES_INTRADAY', 'AAPL', '5min'));
  }

  getListOfCurrencies(): Observable<APIResponse> {  
    return this.mountGETRequest(this.mountAlphaVantageURL('CURRENCY_EXCHANGE_RATE', 'USD', 'EUR'));
  }

  getData(symbol: string, interval: string): Observable<APIResponse> {
    return this.mountGETRequest(this.mountAlphaVantageURL('TIME_SERIES_INTRADAY', symbol, interval));
  }

  get5MinData(symbol: string): Observable<APIResponse> {
    return this.getData(symbol, '5min');
  }

  get15MinData(symbol: string): Observable<APIResponse> {
    return this.getData(symbol, '15min');
  }

  get1hData(symbol: string): Observable<APIResponse> {
    return this.getData(symbol, '60min');
  }

  getAllCurrencyPairs(): Observable<APIResponse[]> {
    const allPairs = ['USDJPY', 'EURUSD', 'EURJPY', 'EURCAD', 'AUDUSD', 'NZDJPY', 'AUDCAD'];
    const observables = allPairs.map(pair => {
      const from_currency = pair.slice(0, 3);
      const to_currency = pair.slice(3);
      const url = `${this.baseUrl}?function=CURRENCY_EXCHANGE_RATE&from_currency=${from_currency}&to_currency=${to_currency}&apikey=${this.apiKey}`;
      return this.mountGETRequest(url);
    });
    return forkJoin(observables);
  }
}
