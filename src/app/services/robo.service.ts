import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, timer } from 'rxjs';
import { MovingAverageSetting } from "../models/MovingAverageSetting.model";

@Injectable({
  providedIn: 'root'
})
export class RoboService {
  public currencyPairs: string[] = [];
  private lastThreeCloses: { [currencyPair: string]: number[] } = {};
  public predictions$: BehaviorSubject<{ [currencyPair: string]: string }> = new BehaviorSubject({});
  private movingAverages: { [currencyPair: string]: number } = {};
  private movingAverageSettings: MovingAverageSetting[] = [];

  constructor(private apiService: ApiService) {
    this.updateCurrencyPairs();
    this.startPredictions();
  }
  getMovingAverage(pair: string): number | null {
    return this.movingAverages[pair] || null;
  }
  updateCurrencyPairs(): void {
    this.apiService.getListOfCurrencies().subscribe(data => {
      if (data['bestMatches']) {
        this.currencyPairs = data['bestMatches'].map((match: any) => match['1. symbol']);
      }
    });
  }

  getListOfCurrencies(): string[] {
    return this.currencyPairs;
  }

  setMovingAverageSettings(settings: MovingAverageSetting[]) {
    this.movingAverageSettings = settings;
    this.applyMovingAverageSettings();
  }

  private applyMovingAverageSettings() {
    this.movingAverageSettings.forEach(setting => {
      const { currencyPairs, type, periods } = setting;
      currencyPairs.forEach(pair => {
        this.updateMovingAverage(pair, type, periods);
      });
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
    timer(initialDelay, 300000)
      .subscribe(() => {
        this.applyMovingAverageSettings();
        this.evaluateMovingAverageCrossovers();
      });
  }

  updateMovingAverage(pair: string, type: string, periods: number) {
    if (this.lastThreeCloses[pair] && this.lastThreeCloses[pair].length >= periods) {
      let sum, average;

      if (type === 'SMA') {
        sum = this.lastThreeCloses[pair].slice(-periods).reduce((acc, price) => acc + price, 0);
        average = sum / periods;
      } else {
        const multiplier = 2 / (periods + 1);
        average = this.lastThreeCloses[pair].slice(0, periods).reduce((acc, price) => acc + price, 0) / periods;
        for (let i = periods; i < this.lastThreeCloses[pair].length; i++) {
          const closePrice = this.lastThreeCloses[pair][i];
          average = (closePrice - average) * multiplier + average;
        }
      }

      this.movingAverages[pair] = average;
    }
  }

  evaluateMovingAverageCrossovers() {
    this.currencyPairs.forEach(pair => {
      const ma = this.movingAverages[pair] || 0;
      const lastClose = this.lastThreeCloses[pair] ? this.lastThreeCloses[pair].slice(-1)[0] : 0;

      if (ma && lastClose) {
        const previousSignal = this.predictions$.getValue()[pair] || null;
        let newSignal = null;

        if (ma > lastClose) {
          newSignal = 'Compra';
        } else {
          newSignal = 'Venda';
        }

        if (previousSignal !== newSignal) {
          this.predictions$.next({ ...this.predictions$.getValue(), [pair]: newSignal });
        }
      }
    });
  }
}
