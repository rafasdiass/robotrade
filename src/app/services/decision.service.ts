import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { FibonacciLevels } from '../models/api.interfaces';
import { BUY, SELL, NO_SIGNAL, RSI_LOWER_LIMIT, RSI_UPPER_LIMIT } from './constants';

@Injectable({
  providedIn: 'root'
})
export class DecisionService {

  constructor(private utilService: UtilService) {}

  makeDecision(prices: number[]): string {
    const rsi = this.utilService.calculateRSI(prices);
    const ema9 = this.utilService.calculateEMA(prices, 9); // EMA de 9 períodos
    const priceChange = this.utilService.calculatePriceChange(prices);
    const stochasticOscillator = this.utilService.calculateStochasticOscillator(prices);
    const fibonacciLevels: FibonacciLevels = this.utilService.calculateFibonacciLevels(Math.min(...prices), Math.max(...prices));

    let score = 0;

    score += this.applyRSIStrategy(rsi);
    score += this.applyEMAStrategy(prices[0], ema9); // Utilizando EMA de 9 períodos
    score += this.applyPriceChangeStrategy(priceChange);
    score += this.applyStochasticOscillatorStrategy(stochasticOscillator);
    score += this.applyFibonacciLevelsStrategy(prices[0], fibonacciLevels);

    return score > 0 ? BUY : score < 0 ? SELL : NO_SIGNAL;
  }

  private applyRSIStrategy(rsi: number): number {
    return rsi < RSI_LOWER_LIMIT ? 1 : rsi > RSI_UPPER_LIMIT ? -1 : 0;
  }

  private applyEMAStrategy(price: number, ema9: number): number {
    return price > ema9 ? 1 : price < ema9 ? -1 : 0;
  }

  private applyPriceChangeStrategy(priceChange: number): number {
    return priceChange > 0 ? 1 : priceChange < 0 ? -1 : 0;
  }

  private applyStochasticOscillatorStrategy(stochasticOscillator: number): number {
    return stochasticOscillator < 20 ? 1 : stochasticOscillator > 80 ? -1 : 0;
  }

  private applyFibonacciLevelsStrategy(price: number, fibonacciLevels: FibonacciLevels): number {
    return (price > fibonacciLevels['61.8%'] && price < fibonacciLevels['100.0%']) ? 1 : 0;
  }
}
