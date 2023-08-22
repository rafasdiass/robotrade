import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { MovingAverageSetting } from '../models/MovingAverageSetting.model';
import { CurrencyPairService } from './currency-pair.service';

@Injectable({
  providedIn: 'root'
})
export class RoboService {
  private lastCloses: { [currencyPair: string]: number[] } = {};
  public predictions$: BehaviorSubject<{ [currencyPair: string]: string }> = new BehaviorSubject({});
  private movingAverages: { [currencyPair: string]: number } = {};
  private RSI: { [currencyPair: string]: number } = {};
  private movingAverageSettings: MovingAverageSetting[] = [];

  constructor(private currencyPairService: CurrencyPairService) {
    this.startPredictions();
    this.currencyPairService.currencyPairs$.subscribe(pairs => {
      
    });
  }

  public updateState(currencyPair: string, closeValue: number) {
    if (!this.lastCloses[currencyPair]) {
      this.lastCloses[currencyPair] = [];
    }
    this.lastCloses[currencyPair].push(closeValue);
    this.lastCloses[currencyPair] = this.lastCloses[currencyPair].slice(-100);
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

  public updateAllData() {
    console.log("updateAllData called");
    this.applyMovingAverageSettings();
    this.updateRSI();
    this.evaluateIndicators();
  }

  setMovingAverageSettings(settings: MovingAverageSetting[]) {
    this.movingAverageSettings = settings;
    this.applyMovingAverageSettings();
  }

  private applyMovingAverageSettings() {
    this.movingAverageSettings.forEach(setting => {
      const { currencyPairs, type, periods } = setting;
      currencyPairs.forEach(pair => {
        const lastCloses = this.lastCloses[pair] || [];
        if (lastCloses.length >= periods) {
          let sum = lastCloses.slice(-periods).reduce((acc, price) => acc + price, 0);
          let average = sum / periods;
          if (type === 'EMA') {
            const multiplier = 2 / (periods + 1);
            average = lastCloses.slice(0, periods).reduce((acc, price) => acc + price, 0) / periods;
            for (let i = periods; i < lastCloses.length; i++) {
              average = (lastCloses[i] - average) * multiplier + average;
            }
          }
          this.movingAverages[pair] = average;
        }
      });
    });
  }

  private updateRSI() {
    Object.keys(this.lastCloses).forEach(pair => {
      const closes = this.lastCloses[pair];
      if (closes.length >= 14) {
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

  public evaluateIndicators() {
    const pairs = Object.keys(this.lastCloses);
    pairs.forEach(pair => {
      const ma = this.movingAverages[pair] || 0;
      const lastClose = this.lastCloses[pair] ? this.lastCloses[pair].slice(-1)[0] : 0;
      const rsi = this.RSI[pair] || 0;
      if (ma && lastClose && rsi) {
        const previousSignal = this.predictions$.getValue()[pair] || null;
        let newSignal = null;
        const maSignal = ma > lastClose ? 'Compra' : 'Venda';
        let rsiSignal = null;
        if (rsi < 30) {
          rsiSignal = 'Compra';
        } else if (rsi > 70) {
          rsiSignal = 'Venda';
        }
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
