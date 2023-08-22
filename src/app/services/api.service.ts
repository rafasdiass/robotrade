import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiKey = '589Y14LQPVGKZQ3N';
  private baseUrl = 'https://www.alphavantage.co/query?';

  constructor(private http: HttpClient) {} // Correção aqui

  getStockData(symbol: string): Observable<any> {
    const endpoint = `${this.baseUrl}function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${this.apiKey}`;
    return this.http.get(endpoint);
  }

  getListOfCurrencies(): Observable<any> {
    const endpoint = `${this.baseUrl}function=SYMBOL_SEARCH&keywords=currency&apikey=${this.apiKey}`;
    return this.http.get(endpoint);
  }
}
