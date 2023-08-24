import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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

  getListOfCurrencies(): Observable<ApiResponse> {
    const endpoint = `${this.baseUrl}function=SYMBOL_SEARCH&keywords=currency&apikey=${this.apiKey}`;
    return this.http.get<ApiResponse>(endpoint).pipe(
      catchError(this.handleError)
    );
  }

  getCandleData(pair: string): Observable<any> {
    const endpoint = `${this.baseUrl}function=TIME_SERIES_INTRADAY&symbol=${pair}&interval=5min&apikey=${this.apiKey}`;
    return this.http.get(endpoint).pipe(
      catchError(this.handleError)
    );
  }
}
