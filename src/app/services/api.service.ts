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
  private baseUrl = environment.baseUrl;
  private apiKey = environment.apiKey;  // Import the API key from the environment file

  constructor(private http: HttpClient) { }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(error);
  }

  private mountURL(endpoint: string, params: string): string {
    return `${this.baseUrl}/${endpoint}?${params}`;
  }

  private mountGETRequest(endpoint: string): Observable<APIResponse> {  
    return this.http.get<APIResponse>(endpoint, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${environment.token}`)  // Use o token do arquivo de ambiente
    }).pipe(  
      catchError(this.handleError)
    );
  }
  
  healthCheck(): Observable<APIResponse> {  
    return this.mountGETRequest(this.mountURL('healthcheck', ''));
  }

  getListOfCurrencies(): Observable<APIResponse> {  
    return this.mountGETRequest(this.mountURL('list-of-currencies', ''));
  }

  getData(ref: string): Observable<APIResponse> {  
    return this.mountGETRequest(this.mountURL(`data/${ref}`, 'start_date=2023-01-01&end_date=2023-12-31'));
  }

  getAllCurrencyPairs(): Observable<APIResponse> {
    const endpoint = this.mountURL('all-currency-pairs', '');
    return this.mountGETRequest(endpoint);
  }

  // Método para obter dados de gráfico de 5 minutos
  get5MinData(ref: string): Observable<APIResponse> {
    return this.mountGETRequest(this.mountURL(`data/${ref}`, 'interval=5min'));
  }

  // Método para obter dados de gráfico de 15 minutos
  get15MinData(ref: string): Observable<APIResponse> {
    return this.mountGETRequest(this.mountURL(`data/${ref}`, 'interval=15min'));
  }

  // Método para obter dados de gráfico de 1 hora
  get1hData(ref: string): Observable<APIResponse> {
    return this.mountGETRequest(this.mountURL(`data/${ref}`, 'interval=1h'));
  }
}
