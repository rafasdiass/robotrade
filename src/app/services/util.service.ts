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
  
    for (let i = 1; i < period; i++) {
      ema = ((prices[i] - ema) * multiplier) + ema;
    }
  
    return ema;
  }

  calculatePriceChange(prices: number[]): number {
    const initialPrice = prices[prices.length - 1];
    const finalPrice = prices[0];
    const priceChange = ((finalPrice - initialPrice) / initialPrice) * 100;
  
    return priceChange;
  }
}
