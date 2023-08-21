import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoboService {

  private symbol = 'AAPL'; // símbolo da ação que o robô vai negociar
  private lastThreeCloses: number[] = []; // últimos três preços de fechamento
  
  // BehaviorSubject para emitir previsões sobre o próximo movimento do candle.
  public prediction$: BehaviorSubject<string> = new BehaviorSubject('Indeterminado');

  constructor(private apiService: ApiService) {
    // Inicia a estratégia de previsão.
    this.startPrediction();
  }

  // Método para iniciar a estratégia de previsão.
  startPrediction() {
    this.prediction$.next('Iniciando previsão...');

    // Assuma que temos um método para buscar dados de candle de 5 minutos
    this.apiService.getStockData(this.symbol).subscribe(data => {
      const latestData = data['Time Series (5min)'];
      for (const time in latestData) {
        const closePrice = parseFloat(latestData[time]['4. close']);
        
        // Atualiza o array dos últimos três preços de fechamento
        if (this.lastThreeCloses.length >= 3) {
          this.lastThreeCloses.shift();
        }
        this.lastThreeCloses.push(closePrice);

        // Estratégia de exemplo para previsão
        if (this.lastThreeCloses.length === 3) {
          const average = this.lastThreeCloses.reduce((a, b) => a + b) / 3;
          const lastClose = this.lastThreeCloses[this.lastThreeCloses.length - 1];
          if (average > lastClose) {
            this.prediction$.next('Prevendo que o próximo candle subirá');
          } else {
            this.prediction$.next('Prevendo que o próximo candle descerá');
          }
        }
      }
    });
  }
}
