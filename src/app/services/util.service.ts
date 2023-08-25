import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() {}

  calculateRSI(prices: number[], period: number = 7): number {
    let gains = 0;
    let losses = 0;
  
    for (let i = 1; i <= period; i++) {
      const difference = prices[i] - prices[i - 1];
      if (difference >= 0) {
        gains += difference;
      } else {
        losses -= difference;
      }
    }
  
    const avgGain = gains / period;
    const avgLoss = losses / period;
  
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
  
    return rsi;
  }

  calculateEMA(prices: number[], period: number = 9): number {
    let ema = prices[0];
    const multiplier = 2 / (period + 1);
  
    for (let i = 1; i < prices.length; i++) {
      ema = ((prices[i] - ema) * multiplier) + ema;
    }
  
    return ema;
  }

  ema9PeriodRule(prices: number[]): string {
    const ema9 = this.calculateEMA(prices, 9);
    const firstCandle = prices[1];
    const secondCandle = prices[2];
    const thirdCandle = prices[0];

    if (firstCandle < ema9 && secondCandle < ema9 && thirdCandle > ema9) {
      return "Retrair";
    }

    return "Sem sinal";
  }

  calculateSMA(prices: number[], period: number): number {
    const sum = prices.slice(0, period).reduce((acc, val) => acc + val, 0);
    return sum / period;
  }

  calculatePriceChange(prices: number[]): number {
    const initialPrice = prices[prices.length - 1];
    const finalPrice = prices[0];
    const priceChange = ((finalPrice - initialPrice) / initialPrice) * 100;
  
    return priceChange;
  }

  calculateStochasticOscillator(prices: number[], period: number = 14): number {
    const recentPrices = prices.slice(0, period);
    const lowestPrice = Math.min(...recentPrices);
    const highestPrice = Math.max(...recentPrices);
    const currentPrice = prices[0];

    if (highestPrice === lowestPrice) {
      return 100; 
    }

    const stochasticOscillator = ((currentPrice - lowestPrice) / (highestPrice - lowestPrice)) * 100;

    return stochasticOscillator;
  }

  calculateFibonacciLevels(low: number, high: number): { [key: string]: number } {
    const diff = high - low;
  
    return {
      '0.0%': low,
      '23.6%': low + diff * 0.236,
      '38.2%': low + diff * 0.382,
      '50.0%': low + diff * 0.5,
      '61.8%': low + diff * 0.618,
      '100.0%': high
    };
  }
  identifyPatterns(prices: number[]): { wPatterns: number[], mPatterns: number[] } {
    const wPatterns: number[] = [];
    const mPatterns: number[] = [];

    for (let i = 4; i < prices.length; i++) {
      const slice = prices.slice(i - 4, i + 1);

      // Identificar padrão W (fundo)
      if (slice[0] > slice[1] && slice[1] < slice[2] && slice[2] > slice[3] && slice[3] < slice[4]) {
        wPatterns.push(i);
      }

      // Identificar padrão M (topo)
      if (slice[0] < slice[1] && slice[1] > slice[2] && slice[2] < slice[3] && slice[3] > slice[4]) {
        mPatterns.push(i);
      }
    }

    return { wPatterns, mPatterns };
  }
}

  
