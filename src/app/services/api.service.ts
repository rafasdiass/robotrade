import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiKey = '2UK176WMOKJTX9SC';
  private baseUrl = 'https://www.alphavantage.co/query?';

  private http = inject (HttpClient) 

  getStockData(symbol: string): Observable<any> {
    const endpoint = `${this.baseUrl}function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${this.apiKey}`;
    return this.http.get(endpoint);
  }
  getListOfCurrencies(): Observable<any> {
    const endpoint = `${this.baseUrl}function=SYMBOL_SEARCH&keywords=currency&apikey=${this.apiKey}`;
    return this.http.get(endpoint);
  }
}
