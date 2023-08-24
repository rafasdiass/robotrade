import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiKey = '589Y14LQPVGKZQ3N';  // Chave de API da Alpha Vantage
  private baseUrl = 'https://www.alphavantage.co/query?';  // URL base da Alpha Vantage

  constructor(private http: HttpClient) {}

  // Método para lidar com erros de API
  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(error);
  }

  // Método para validar se a API está funcionando
  validateAPI(): Observable<any> {
    const endpoint = `${this.baseUrl}function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=5min&apikey=${this.apiKey}`;
    return this.http.get(endpoint).pipe(
      catchError(this.handleError)
    );
  }

  // Método para obter a lista de moedas (exemplo)
  getListOfCurrencies(): Observable<any> {
    const endpoint = `${this.baseUrl}function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=JPY&apikey=${this.apiKey}`;
    return this.http.get(endpoint).pipe(
      catchError(this.handleError)
    );
  }

  // Método para obter dados de candle (exemplo)
  getCandleData(pair: string): Observable<any> {
    const endpoint = `${this.baseUrl}function=TIME_SERIES_INTRADAY&symbol=${pair}&interval=5min&apikey=${this.apiKey}`;
    return this.http.get(endpoint).pipe(
      catchError(this.handleError)
    );
  }

  // Método para obter dados de ações (exemplo)
getStockData(symbol: string): Observable<any> {
  const endpoint = `${this.baseUrl}function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${this.apiKey}`;
  return this.http.get(endpoint).pipe(
    catchError(this.handleError)
  );
}


 
}
