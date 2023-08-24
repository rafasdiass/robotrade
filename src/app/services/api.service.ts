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
  private apiKey = 'ijFr5C7UzR6TGkVtMMgV';  // Chave de API do Nasdaq Data Link
  private baseUrl = 'https://www.quandl.com/api/v3/datatables/';  // URL base do Nasdaq Data Link

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(error);
  }

  getStockData(symbol: string): Observable<any> {
    const endpoint = `${this.baseUrl}WIKI/PRICES?qopts.columns=date,close&api_key=${this.apiKey}&ticker=${symbol}`;
    return this.http.get(endpoint).pipe(
      catchError(this.handleError)
    );
  }

  getListOfCurrencies(): Observable<any> {
    // Substitua este endpoint pelo endpoint apropriado do Nasdaq Data Link para obter dados de moedas
    const endpoint = `${this.baseUrl}YOUR_ENDPOINT_HERE?api_key=${this.apiKey}`;
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
    // Substitua este endpoint pelo endpoint apropriado do Nasdaq Data Link para obter dados de candlestick
    const endpoint = `${this.baseUrl}YOUR_ENDPOINT_HERE?api_key=${this.apiKey}&symbol=${pair}`;
    return this.http.get(endpoint).pipe(
      catchError(this.handleError)
    );
  }

  // Método de validação para testar a API
  validateAPI(): Observable<any> {
    const testEndpoint = `${this.baseUrl}WIKI/PRICES?qopts.columns=date,close&api_key=${this.apiKey}&ticker=MSFT`;
    return this.http.get(testEndpoint).pipe(
      catchError(this.handleError)
    );
  }
}
