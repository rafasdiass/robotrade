import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { LearningService } from './learning.service';
import { BUY, SELL, NO_SIGNAL, RSI_LOWER_LIMIT, RSI_UPPER_LIMIT } from './constants';

const STOCHASTIC_LOWER_LIMIT = 20;
const STOCHASTIC_UPPER_LIMIT = 80;
const FIBONACCI_LOWER_LEVEL = '61.8%';
const FIBONACCI_UPPER_LEVEL = '100.0%';

@Injectable({
  providedIn: 'root'
})
export class DecisionService {

  constructor(private utilService: UtilService, private learningService: LearningService) {
    console.log("DecisionService iniciado");
  }

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

    const weights = this.learningService.getWeights(); // Obtenção dos pesos
    console.log("Pesos atuais: ", weights);

    const indicators = {
      rsi: this.getRSIScore(this.utilService.calculateRSI(prices5min)),
      ema: this.getEMAScore(prices5min[0], this.utilService.calculateEMA(prices5min, 9)),
      priceChange: this.getPriceChangeScore(this.utilService.calculatePriceChange(prices5min)),
      stochasticOscillator: this.getStochasticOscillatorScore(this.utilService.calculateStochasticOscillator(prices5min)),
      fibonacciLevel: this.getFibonacciLevelScore(prices5min[0], this.utilService.calculateFibonacciLevels(Math.min(...prices5min), Math.max(...prices5min))),
      pattern: this.getPatternScore(this.utilService.identifyPatterns(prices5min), prices5min.length - 1)
    };

    console.log("Indicadores calculados: ", indicators);

    let totalScore = this.learningService.makeDecision(indicators);

    // Salva o resultado para futuras decisões
    this.learningService.storeResult(indicators, totalScore > 0);
    console.log("Resultado armazenado para futuras decisões");

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

    console.log("Decisão final: ", decision);
    return decision;
  }

  private getRSIScore(rsi: number): number {
    return rsi < RSI_LOWER_LIMIT ? 1 : rsi > RSI_UPPER_LIMIT ? -1 : 0;
  }

  private getEMAScore(price: number, ema9: number): number {
    return price > ema9 ? 1 : price < ema9 ? -1 : 0;
  }

  private getPriceChangeScore(priceChange: number): number {
    return Math.sign(priceChange);
  }

  private getStochasticOscillatorScore(stochasticOscillator: number): number {
    return stochasticOscillator < STOCHASTIC_LOWER_LIMIT ? 1 : stochasticOscillator > STOCHASTIC_UPPER_LIMIT ? -1 : 0;
  }

  private getFibonacciLevelScore(price: number, fibonacciLevels: { [key: string]: number }): number {
    return price > fibonacciLevels[FIBONACCI_LOWER_LEVEL] && price < fibonacciLevels[FIBONACCI_UPPER_LEVEL] ? 1 : 0;
  }

  private getPatternScore({ wPatterns, mPatterns }: { wPatterns: number[], mPatterns: number[] }, lastIndex: number): number {
    return wPatterns.includes(lastIndex) ? 1 : mPatterns.includes(lastIndex) ? -1 : 0;
  }
}
