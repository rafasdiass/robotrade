import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'https://your-api-endpoint.com'; // Substitua pelo endpoint da sua API

  constructor(private http: HttpClient) { }

  // Método para coletar sinais do mercado aberto
  getOpenMarketSignals(): Observable<any> {
    const endpoint = `${this.apiUrl}/open-market-signals`; // Substitua pelo endpoint correto
    return this.http.get(endpoint);
  }

  // Adicione outros métodos conforme necessário para outras chamadas API
}