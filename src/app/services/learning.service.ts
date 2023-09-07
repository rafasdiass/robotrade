import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LearningService {

  private defaultWeights: { [key: string]: number } = {
    rsi: 1,
    ema: 1,
    priceChange: 1,
    stochasticOscillator: 1,
    fibonacciLevel: 1,
    pattern: 1
  };

  private weights!: { [key: string]: number };
  private decayFactor = 0.9; 
  private learningRate = 0.1; 

  constructor() {
    this.loadWeights();
  }

  private loadWeights() {
    const savedWeights = localStorage.getItem('indicatorWeights');
    this.weights = savedWeights ? JSON.parse(savedWeights) : { ...this.defaultWeights };
  }

  private saveWeights() {
    for (let key in this.weights) {
      this.weights[key] *= this.decayFactor;
    }
    localStorage.setItem('indicatorWeights', JSON.stringify(this.weights));
  }

  storeResult(indicators: { [key: string]: number }, success: boolean) {
    for (let key in indicators) {
      const delta = success ? this.learningRate : -this.learningRate;
      this.weights[key] += delta;
    }

    const sum = Object.values(this.weights).reduce((a: number, b: number) => a + b, 0);
    for (let key in this.weights) {
      this.weights[key] /= sum;
    }

    this.saveWeights();
  }

  makeDecision(indicators: { [key: string]: number }) {
    let score = 0;
    for (let key in indicators) {
      score += this.weights[key] * indicators[key];
    }

    // Consider correlation between different indicators
    if (indicators['rsi'] > 0 && indicators['priceChange'] < 0) {
      score *= 0.9; // Reduce the score if RSI and priceChange are giving opposite signals
    }

    return score;
  }

  getWeights() {
    return this.weights;
  }
}
