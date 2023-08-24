import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // TODO: passar para dot env file e usar o process.env no .environments
  private apiKey = '589Y14LQPVGKZQ3N';  // Chave de API da Alpha Vantage
  // TODO: passar para o  .environments
  private baseUrl = 'https://www.alphavantage.co';  // URL base da Alpha Vantage

  constructor(private http: HttpClient) { }

  // Método para lidar com erros de API
  private handleError(error: any) {
    console.error('API Error:', error);
    // NOTE: este recurso e modo de uso estão depreciados, verifique e doc para usar o modo correto 
    // NOTE: Sugestão: vc pode usar o o ß
    return throwError(error);
  }

  /**
   * NOTE: refactor explicativo 
   * 
   * 
   * O motivo ou principio do refactor: DRY (Don't Repeat Yourself), o D em SOLID 
   * 
   * No caso, suas funções anteriores (comentadas), possuim apenas um ponto em que mudam, o endpoint, 
   * no demais, são todas identicas. 
   * 
   * Para isso, vamos isolar os comportamento: 
   * - montagem da URL 
   * - montagem da requisição 
   * - parametrização do endpoint
   * 
   * O código à seguir é o resultado do refactor, com as devidas explicações
   * 
   * OBS: Alguns dados foram preenchidos pelo Copilot, por favor revise os parametros
   */

  /**
   * O que foi aplicado aqui: 
   * 
   * 1. Remove a parte "query?" do baseURL e aplica aqui, faz mais sentido baseado na momenclatura
   * 2. Como vc usa o TIME_SERIES_INTRADAY na maioria das vezes, colocamos ela aqui com o valor default
   * 3. Adicionamos os parametros conforme sua ordem de importancia
   */
  private mountURL(params: string, func: string = 'TIME_SERIES_INTRADAY'): string {
    return `${this.baseUrl}/query?apiKey=${this.apiKey}&function=${func}&${params}`;
  }

  /**
   * O que foi aplicado aqui: 
   * 
   * 1. Isolamento do comportamento que é repetido em todas as funções
   * 
   * OBS: não fiz a mudança sobre o ponto do uso depreciado q comentei na função handleError, deixo isso para vc, 
   * mas no futuro, vc pode remover a função handler error e usa-lo aqui
   * 
   * Também não há vantagem de tipar o retorno quando vc usa um any. Fica como sugestão vc tipar o retorno
   * 
   * TODO: tipar o retorno
   */
  private mountGETRequest(endpoint: string): Observable<any> {
    return this.http.get(endpoint).pipe(
      catchError(this.handleError)
    );
  }

  // Nome mais sugestivo. Como o nome do serviço já tem API, vc n precisa repeti-lo no nome do método
  healthCheck() { return this.mountGETRequest(this.mountURL('symbol=MSFT&interval=5min')) }
  getListOfCurrencies() { return this.mountGETRequest(this.mountURL('from_currency=USD&to_currency=JPY', 'CURRENCY_EXCHANGE_RATE')) }

  /**
   * O que foi aplicado aqui: 
   *
   * 1. Padronização do nome do arquivomento quer servirá como symbol 
   * 2. Não usei symbol como nome por o JS há ter uma palavra chave reservada para Symbol (com S maisculo), o que não é uma regra, mas 
   * acredito que seja uma boa prática evitar
   *  
   */
  getCandleData(ref: string) { return this.mountGETRequest(this.mountURL(`symbol=${ref}&interval=5min`)) }
  getStockData(ref: string) { return this.mountGETRequest(this.mountURL(`symbol=${ref}&interval=5min`)) }

  // Método para validar se a API está funcionando
  // NOTE: Estou deixando sem comentar para q os locais q o chamam não quebrem, mas vc pode remover após renomear para a nova função
  validateAPI(): Observable<any> {
    const endpoint = `${this.baseUrl}function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=5min&apikey=${this.apiKey}`;
    return this.http.get(endpoint).pipe(
      catchError(this.handleError)
    );
  }

  // Método para obter a lista de moedas (exemplo)
  // getListOfCurrencies(): Observable<any> {
  //   const endpoint = `${this.baseUrl}function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=JPY&apikey=${this.apiKey}`;
  //   return this.http.get(endpoint).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  // Método para obter dados de candle (exemplo)
  // getCandleData(pair: string): Observable<any> {
  //   const endpoint = `${this.baseUrl}function=TIME_SERIES_INTRADAY&symbol=${pair}&interval=5min&apikey=${this.apiKey}`;
  //   return this.http.get(endpoint).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  // Método para obter dados de ações (exemplo)
  // getStockData(symbol: string): Observable<any> {
  //   const endpoint = `${this.baseUrl}function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${this.apiKey}`;
  //   return this.http.get(endpoint).pipe(
  //     catchError(this.handleError)
  //   );
  // }


}
