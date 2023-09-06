import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { APIResponse } from '../models/api.interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiEnv.baseUrl;
  private readonly apiKey = environment.apiEnv.apiKey;

  constructor(private readonly http: HttpClient) { }

  public fetchTimeSeriesData(symbol: string, interval: string): Observable<APIResponse> {
    const url = `${this.baseUrl}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${this.apiKey}`;
    return this.http.get<APIResponse>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(error);
  }
  
  // O método getListOfCurrencies foi removido para simplificar o serviço.
  // Se você ainda precisa dessa funcionalidade, considere adicioná-la em um serviço separado
  // ou então apenas dentro do CurrencyPairService.
}
