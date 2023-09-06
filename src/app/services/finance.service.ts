import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private baseUrl = environment.apiEnv.baseUrl;
  private apiKey = environment.apiEnv.apiKey;

  constructor(private http: HttpClient) { }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(error);
  }

  private mountAlphaVantageURL(functionType: string, symbol: string, interval: string): string {
    return `${this.baseUrl}/query?function=${functionType}&symbol=${symbol}&interval=${interval}&apikey=${this.apiKey}`;
  }

  private mountGETRequest(url: string): Observable<any> {
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }

  getStockData(symbol: string, interval: string): Observable<any> {
    return this.mountGETRequest(this.mountAlphaVantageURL('TIME_SERIES_INTRADAY', symbol, interval));
  }

  // Para a Alpha Vantage, você poderia obter indicadores técnicos como figuras gráficas
  getFigures(symbol: string, interval: string, series_type: string): Observable<any> {
    const functionType = 'SMA'; // Por exemplo, usando Média Móvel Simples (Simple Moving Average)
    return this.mountGETRequest(`${this.baseUrl}/query?function=${functionType}&symbol=${symbol}&interval=${interval}&time_period=10&series_type=${series_type}&apikey=${this.apiKey}`);
  }
}
