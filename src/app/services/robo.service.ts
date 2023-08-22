import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, timer } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RoboService {
  public currencyPairs: string[] = [];  // Inicializado como vazio
  private lastThreeCloses: { [currencyPair: string]: number[] } = {};
  public predictions$: BehaviorSubject<{ [currencyPair: string]: string }> = new BehaviorSubject({});
  private movingAverages: { [currencyPair: string]: number } = {};

  constructor(private apiService: ApiService) {
    this.updateCurrencyPairs();  // Atualiza currencyPairs a partir da API
    this.startPredictions();
  }

  updateCurrencyPairs(): void {
    this.apiService.getListOfCurrencies().subscribe(data => {
      if (data['bestMatches']) {
        this.currencyPairs = data['bestMatches'].map((match: any) => match['1. symbol']);
        this.currencyPairs.forEach(pair => {
          if (!this.lastThreeCloses[pair]) {
            this.lastThreeCloses[pair] = [];
          }
        });
      }
    });
  }

  getNextFiveMinuteMark(): number {
    const now = new Date();
    const next = new Date(now);
    next.setMinutes(Math.ceil(now.getMinutes() / 5) * 5);
    next.setSeconds(0);
    next.setMilliseconds(0);
    return next.getTime() - now.getTime();
  }

  startPredictions() {
    const initialDelay = this.getNextFiveMinuteMark();
    timer(initialDelay, 300000)
      .subscribe(() => {
        this.currencyPairs.forEach(pair => {
          this.apiService.getStockData(pair).subscribe((data: any) => {
            const latestData = data['Time Series (5min)'];
            for (const time in latestData) {
              const closePrice = parseFloat(latestData[time]['4. close']);
              
              if (this.lastThreeCloses[pair].length >= 3) {
                this.lastThreeCloses[pair].shift();
              }
              this.lastThreeCloses[pair].push(closePrice);

              if (this.lastThreeCloses[pair].length === 3) {
                const average = this.lastThreeCloses[pair].reduce((a, b) => a + b) / 3;
                const lastClose = this.lastThreeCloses[pair][this.lastThreeCloses[pair].length - 1];
                
                if (average > lastClose) {
                  this.predictions$.next({ ...this.predictions$.getValue(), [pair]: 'Compra' });
                } else {
                  this.predictions$.next({ ...this.predictions$.getValue(), [pair]: 'Venda' });
                }
              }
            }
          });
        });
      });
  }

  updateMovingAverage(pair: string, type: string, periods: number) {
    if (this.lastThreeCloses[pair].length >= periods) {
      if (type === 'SMA') {
        const lastNPrices = this.lastThreeCloses[pair].slice(-periods);
        const sum = lastNPrices.reduce((acc, price) => acc + price, 0);
        this.movingAverages[pair] = sum / periods;
      } else if (type === 'EMA') {
        const multiplier = 2 / (periods + 1);
        let EMA = this.lastThreeCloses[pair].slice(0, periods).reduce((acc, price) => acc + price, 0) / periods; // SMA as the first EMA
        for (let i = periods; i < this.lastThreeCloses[pair].length; i++) {
          const closePrice = this.lastThreeCloses[pair][i];
          EMA = (closePrice - EMA) * multiplier + EMA;
        }
        this.movingAverages[pair] = EMA;
      }
    }
  }

  getMovingAverage(pair: string): number {
    return this.movingAverages[pair] || 0;
  }

}
