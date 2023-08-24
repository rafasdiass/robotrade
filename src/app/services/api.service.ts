import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { APIResponse } from '../models/api.interfaces'; 

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiKey = environment.apiKey;  
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(error);
  }
 
  private mountURL(params: string, func: string = 'TIME_SERIES_INTRADAY'): string {
    return `${this.baseUrl}/query?apiKey=${this.apiKey}&function=${func}&${params}`;
  }
 
  private mountGETRequest(endpoint: string): Observable<APIResponse> {  // Use a interface APIResponse aqui
    return this.http.get<APIResponse>(endpoint).pipe(  // Use a interface APIResponse aqui
      catchError(this.handleError)
    );
  }
  
  healthCheck(): Observable<APIResponse> {  // Use a interface APIResponse aqui
    return this.mountGETRequest(this.mountURL('symbol=MSFT&interval=5min'));
  }

  getListOfCurrencies(): Observable<APIResponse> {  // Use a interface APIResponse aqui
    return this.mountGETRequest(this.mountURL('from_currency=USD&to_currency=JPY', 'CURRENCY_EXCHANGE_RATE'));
  }

  getData(ref: string): Observable<APIResponse> {  // Use a interface APIResponse aqui
    return this.mountGETRequest(this.mountURL(`symbol=${ref}&interval=5min`));
  }
}
