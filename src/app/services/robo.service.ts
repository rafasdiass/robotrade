import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, timer } from 'rxjs';
import { MovingAverageSetting } from '../models/MovingAverageSetting.model';

@Injectable({
  providedIn: 'root'
})
export class RoboService {
  public currencyPairs: string[] = [];
  private lastCloses: { [currencyPair: string]: number[] } = {};
  public predictions$: BehaviorSubject<{ [currencyPair: string]: string }> = new BehaviorSubject({});
  private movingAverages: { [currencyPair: string]: number } = {};
  private RSI: { [currencyPair: string]: number } = {};
  private movingAverageSettings: MovingAverageSetting[] = [];
  public currencyPairs$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(private apiService: ApiService) {
    this.updateCurrencyPairs();
    this.startPredictions();
  }

  updateCurrencyPairs(): void {
    this.apiService.getListOfCurrencies().subscribe(data => {
      if (data && data['bestMatches']) {
        this.currencyPairs = data['bestMatches']
          .map((match: any) => match['1. symbol'])
          .filter((symbol: string) => /EUR|USD|JPY|CAD/.test(symbol));
        this.currencyPairs$.next(this.currencyPairs);
      }
    });
  }

  private getNextFiveMinuteMark(): number {
    const now = new Date();
    const next = new Date(now);
    next.setMinutes(Math.ceil(now.getMinutes() / 5) * 5);
    next.setSeconds(0);
    next.setMilliseconds(0);
    return next.getTime() - now.getTime();
  }

  startPredictions() {
    const initialDelay = this.getNextFiveMinuteMark();
    timer(initialDelay, 300000).subscribe(() => {
      this.updateAllData();
    });
  }
  public triggerEvaluateIndicators() {
    this.evaluateIndicators();
  }
  
  private updateAllData() {
    // In reality, you might want to get updated data from the API here
    // For this example, I'm just going to call the methods to evaluate indicators
    this.applyMovingAverageSettings();
    this.updateRSI();
    this.evaluateIndicators();
  }

  setMovingAverageSettings(settings: MovingAverageSetting[]) {
    this.movingAverageSettings = settings;
    this.applyMovingAverageSettings();
  }

  private applyMovingAverageSettings() {
    if (this.movingAverageSettings) {
      this.movingAverageSettings.forEach(setting => {
        const { currencyPairs, type, periods } = setting;
        if (currencyPairs) {
          currencyPairs.forEach(pair => {
            const lastCloses = this.lastCloses[pair] || [];
            if (lastCloses.length >= periods) {
              let sum, average;

              if (type === 'SMA') {
                sum = lastCloses.slice(-periods).reduce((acc, price) => acc + price, 0);
                average = sum / periods;
              } else {
                const multiplier = 2 / (periods + 1);
                average = lastCloses.slice(0, periods).reduce((acc, price) => acc + price, 0) / periods;
                for (let i = periods; i < lastCloses.length; i++) {
                  average = (lastCloses[i] - average) * multiplier + average;
                }
              }

              this.movingAverages[pair] = average;
            }
          });
        }
      });
    }
  }

  private updateRSI() {
    // This is a basic RSI calculation and presumes that you have an array of previous closes
    Object.keys(this.lastCloses).forEach(pair => {
      const closes = this.lastCloses[pair];
      if (closes.length >= 14) { // RSI typically uses a period of 14
        const gains = [];
        const losses = [];
        for (let i = 1; i < closes.length; i++) {
          const change = closes[i] - closes[i - 1];
          if (change >= 0) {
            gains.push(change);
          } else {
            losses.push(Math.abs(change));
          }
        }
        const avgGain = gains.reduce((acc, gain) => acc + gain, 0) / 14;
        const avgLoss = losses.reduce((acc, loss) => acc + loss, 0) / 14;

        const RS = avgLoss === 0 ? 0 : avgGain / avgLoss;
        const RSI = 100 - (100 / (1 + RS));
        this.RSI[pair] = RSI;
      }
    });
  }

  private evaluateIndicators() {
    if (this.currencyPairs) {
      this.currencyPairs.forEach(pair => {
        const ma = this.movingAverages[pair] || 0;
        const lastClose = this.lastCloses[pair] ? this.lastCloses[pair].slice(-1)[0] : 0;
        const rsi = this.RSI[pair] || 0;

        if (ma && lastClose && rsi) {
          const previousSignal = this.predictions$.getValue()[pair] || null;
          let newSignal = null;

          // Moving Average
          const maSignal = ma > lastClose ? 'Compra' : 'Venda';

          // RSI
          let rsiSignal = null;
          if (rsi < 30) {
            rsiSignal = 'Compra';
          } else if (rsi > 70) {
            rsiSignal = 'Venda';
          }

          // Final Decision
          if (maSignal === 'Compra' && rsiSignal === 'Compra') {
            newSignal = 'Compra Forte';
          } else if (maSignal === 'Venda' && rsiSignal === 'Venda') {
            newSignal = 'Venda Forte';
          } else {
            newSignal = 'Manter';
          }

          if (previousSignal !== newSignal) {
            this.predictions$.next({ ...this.predictions$.getValue(), [pair]: newSignal });
          }
        }
      });
    }
  }
}
