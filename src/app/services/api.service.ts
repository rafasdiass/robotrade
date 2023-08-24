import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Definindo a interface para a resposta da API
export interface ApiResponse {
  bestMatches: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiKey = '589Y14LQPVGKZQ3N';
  private baseUrl = 'https://www.alphavantage.co/query?';

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(error);
  }

  getStockData(symbol: string): Observable<any> {
    const endpoint = `${this.baseUrl}function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${this.apiKey}`;
    return this.http.get(endpoint).pipe(
      catchError(this.handleError)
    );
  }

  getListOfCurrencies(): Observable<any> {
    const endpoint = `${this.baseUrl}function=SYMBOL_SEARCH&keywords=currency&apikey=${this.apiKey}`;
    return this.http.get<ApiResponse>(endpoint).pipe(
      map(data => {
        if (data && data.bestMatches) {
          return data.bestMatches.filter((match: any) => 
            /EUR|USD|JPY|CAD/.test(match['1. symbol'])
          );
        }
        return [];
      }),
      catchError(this.handleError)
    );
  }

  getCandleData(pair: string): Observable<any> {
    const endpoint = `${this.baseUrl}function=TIME_SERIES_INTRADAY&symbol=${pair}&interval=5min&apikey=${this.apiKey}`;
    return this.http.get(endpoint).pipe(
      catchError(this.handleError)
    );
  }

  // Método de validação para testar a API
  validateAPI(): Observable<any> {
    const testEndpoint = `${this.baseUrl}function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=5min&apikey=${this.apiKey}`;
    return this.http.get(testEndpoint).pipe(
      catchError(this.handleError)
    );
  }
}
