import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { APIResponse } from '../models/api.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.baseUrl;  // Alpha Vantage Base URL
  private apiKey = environment.apiKey;  // Alpha Vantage API key

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

  // Example: Health Check - you might want to replace this with something relevant to Alpha Vantage
  healthCheck(): Observable<APIResponse> {  
    return this.mountGETRequest(this.mountAlphaVantageURL('TIME_SERIES_INTRADAY', 'AAPL', '5min'));
  }

  // Getting list of currencies - Again, adjust this according to the Alpha Vantage API
  getListOfCurrencies(): Observable<APIResponse> {  
    return this.mountGETRequest(this.mountAlphaVantageURL('CURRENCY_EXCHANGE_RATE', 'USD', 'EUR'));
  }

  // Getting data - adjust parameters as needed
  getData(symbol: string, interval: string): Observable<APIResponse> {
    return this.mountGETRequest(this.mountAlphaVantageURL('TIME_SERIES_INTRADAY', symbol, interval));
  }

  // Getting 5 min data
  get5MinData(symbol: string): Observable<APIResponse> {
    return this.getData(symbol, '5min');
  }

  // Getting 15 min data
  get15MinData(symbol: string): Observable<APIResponse> {
    return this.getData(symbol, '15min');
  }

  // Getting 1h data
  get1hData(symbol: string): Observable<APIResponse> {
    return this.getData(symbol, '60min');
  }

  // Add other methods as you see fit
}
