import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoboService {
  private currencyPairs: string[] = ['USDJPY', 'EURUSD', 'GBPUSD'];
  private lastThreeCloses: { [currencyPair: string]: number[] } = {};
  public predictions$: BehaviorSubject<{ [currencyPair: string]: string }> = new BehaviorSubject({});
  private movingAverages: { [currencyPair: string]: number } = {};

  constructor(private apiService: ApiService) {
    this.currencyPairs.forEach(pair => this.lastThreeCloses[pair] = []);
    this.startPredictions();
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
    timer(initialDelay, 300000) // Starts at the next 5-min mark, then every 5 mins
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
      let movingAverage = 0;
      if (type === 'simple') {
        const lastNPrices = this.lastThreeCloses[pair].slice(-periods);
        const sum = lastNPrices.reduce((acc, price) => acc + price, 0);
        movingAverage = sum / periods;
      } else if (type === 'exponential') {
        // Implemente sua lógica de média móvel exponencial aqui
      }
      this.movingAverages[pair] = movingAverage;
    }
  }

  getMovingAverage(pair: string): number {
    return this.movingAverages[pair] || 0;
  }
}
