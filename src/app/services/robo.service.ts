import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoboService {
  private currencyPairs: string[] = ['USDJPY', 'EURUSD', 'GBPUSD']; // Exemplo de pares de moedas que o robô vai negociar
  private lastThreeCloses: { [currencyPair: string]: number[] } = {}; // últimos três preços de fechamento para cada par de moedas
  public predictions$: BehaviorSubject<{ [currencyPair: string]: string }> = new BehaviorSubject({});

  constructor(private apiService: ApiService) {
    // Aqui você pode substituir com uma chamada para obter uma lista real de pares de moedas da sua API
    // Exemplo: this.apiService.getListOfCurrencies().subscribe(data => { ... });
    this.currencyPairs.forEach(pair => this.lastThreeCloses[pair] = []);
    this.startPredictions();
  }

  startPredictions() {
    this.currencyPairs.forEach(pair => {
      this.apiService.getStockData(pair).subscribe(data => {
        const latestData = data['Time Series (5min)'];
        for (const time in latestData) {
          const closePrice = parseFloat(latestData[time]['4. close']);
          
          if (!this.lastThreeCloses[pair]) {
            this.lastThreeCloses[pair] = [];
          }
          
          if (this.lastThreeCloses[pair].length >= 3) {
            this.lastThreeCloses[pair].shift();
          }
          
          this.lastThreeCloses[pair].push(closePrice);

          if (this.lastThreeCloses[pair].length === 3) {
            const average = this.lastThreeCloses[pair].reduce((a, b) => a + b) / 3;
            const lastClose = this.lastThreeCloses[pair][this.lastThreeCloses[pair].length - 1];
            
            if (average > lastClose) {
              this.predictions$.next({ [pair]: 'Prevendo que o próximo candle subirá' });
            } else {
              this.predictions$.next({ [pair]: 'Prevendo que o próximo candle descerá' });
            }
          }
        }
      });
    });
  }
}
