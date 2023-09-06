import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { BUY, SELL, NO_SIGNAL, RSI_LOWER_LIMIT, RSI_UPPER_LIMIT } from './constants';

const STOCHASTIC_LOWER_LIMIT = 20;
const STOCHASTIC_UPPER_LIMIT = 80;
const FIBONACCI_LOWER_LEVEL = '61.8%';
const FIBONACCI_UPPER_LEVEL = '100.0%';

@Injectable({
  providedIn: 'root'
})
export class DecisionService {

  constructor(private utilService: UtilService) {}

  makeDecision(currencyPair: string, prices5min: number[], prices15min: number[], prices1h: number[]): string {
    console.log("Currency Pair: ", currencyPair);
    console.log("Preços 5min: ", prices5min);
    console.log("Preços 15min: ", prices15min);
    console.log("Preços 1h: ", prices1h);

    if (!prices5min.length) {
      console.error("Dados de preços de 5 minutos insuficientes para tomar uma decisão.");
      return NO_SIGNAL;
    }

    if (!prices15min.length || !prices1h.length) {
      console.warn("Dados auxiliares de preços insuficientes; tomando decisão apenas com base nos preços de 5 minutos.");
    }

    const rsiScore = this.getRSIScore(this.utilService.calculateRSI(prices5min));
    const emaScore = this.getEMAScore(prices5min[0], this.utilService.calculateEMA(prices5min, 9));
    const priceChangeScore = this.getPriceChangeScore(this.utilService.calculatePriceChange(prices5min));
    const stochasticOscillatorScore = this.getStochasticOscillatorScore(this.utilService.calculateStochasticOscillator(prices5min));
    const fibonacciLevelScore = this.getFibonacciLevelScore(prices5min[0], this.utilService.calculateFibonacciLevels(Math.min(...prices5min), Math.max(...prices5min)));
    const patternScore = this.getPatternScore(this.utilService.identifyPatterns(prices5min), prices5min.length - 1);

    const totalScore = rsiScore + emaScore + priceChangeScore + stochasticOscillatorScore + fibonacciLevelScore + patternScore;

    if (totalScore === 0) {
      return 'Sem sinal';
    }

    let decision = '';
    let confidence = Math.abs(totalScore);

    if (totalScore > 0) {
      decision = `Compra com ${confidence * 10}% de confiança`;
    } else {
      decision = `Venda com ${confidence * 10}% de confiança`;
    }

    return decision;
  }

  private getRSIScore(rsi: number): number {
    return rsi < RSI_LOWER_LIMIT ? 1 : rsi > RSI_UPPER_LIMIT ? -1 : 0;
  }

  private getEMAScore(price: number, ema9: number): number {
    if (price > ema9) return 1;
    if (price < ema9) return -1;
    return 0;
  }

  private getPriceChangeScore(priceChange: number): number {
    return Math.sign(priceChange);
  }

  private getStochasticOscillatorScore(stochasticOscillator: number): number {
    if (stochasticOscillator < STOCHASTIC_LOWER_LIMIT) return 1;
    if (stochasticOscillator > STOCHASTIC_UPPER_LIMIT) return -1;
    return 0;
  }

  private getFibonacciLevelScore(price: number, fibonacciLevels: { [key: string]: number }): number {
    if (price > fibonacciLevels[FIBONACCI_LOWER_LEVEL] && price < fibonacciLevels[FIBONACCI_UPPER_LEVEL]) {
      return 1;
    }
    return 0;
  }

  private getPatternScore({ wPatterns, mPatterns }: { wPatterns: number[], mPatterns: number[] }, lastIndex: number): number {
    if (wPatterns.includes(lastIndex)) return 1;
    if (mPatterns.includes(lastIndex)) return -1;
    return 0;
  }
}
