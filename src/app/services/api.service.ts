import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { APIResponse } from '../models/api.interfaces';

interface AuthResponse {
  access_token: string;
  expires_in: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiKey = environment.apiKey;  
  private baseUrl = environment.baseUrl;
  private clientId = environment.clientId; 
  private clientSecret = environment.clientSecret; 
  public accessToken: string | null = null;

  constructor(private http: HttpClient) { }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(error);
  }

  authenticate(): Observable<AuthResponse> {
    const body = {
      client_id: this.clientId,
      client_secret: this.clientSecret
    };
    const authUrl = `${this.baseUrl}/v1/auth/token`;
    return this.http.post<AuthResponse>(authUrl, body, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(this.handleError),
      map(response => {
        this.accessToken = response.access_token;
        return response;
      })
    );
  }

  private mountNasdaqURL(endpoint: string, params: string): string {
    return `${this.baseUrl}/${endpoint}?api_key=${this.apiKey}&${params}`;
  }

  private mountGETRequest(endpoint: string): Observable<APIResponse> {  
    return this.http.get<APIResponse>(endpoint).pipe(  
      catchError(this.handleError)
    );
  }
  
  healthCheck(): Observable<APIResponse> {  
    return this.mountGETRequest(this.mountNasdaqURL('datasets/WIKI/AAPL.csv', 'order=asc'));
  }

  getListOfCurrencies(): Observable<APIResponse> {  
    return this.mountGETRequest(this.mountNasdaqURL('datasets/CURRENCY/USDJPY.csv', ''));
  }

  getData(ref: string): Observable<APIResponse> {  
    return this.mountGETRequest(this.mountNasdaqURL(`datasets/${ref}/candles.csv`, 'start_date=2023-01-01&end_date=2023-12-31'));
  }

  getAllCurrencyPairs(): Observable<APIResponse> {
    const endpoint = this.mountNasdaqURL('datasets/CURRENCY/ALL_PAIRS.csv', '');
    return this.http.get<APIResponse>(endpoint).pipe(
      catchError(this.handleError)
    );
  }
}
