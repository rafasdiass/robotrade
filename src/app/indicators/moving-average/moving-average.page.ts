import { Component, OnInit } from '@angular/core';
import { RoboService } from '../../services/robo.service';

@Component({
  selector: 'app-moving-average',
  templateUrl: './moving-average.page.html',
  styleUrls: ['./moving-average.page.scss'],
})
export class MovingAveragePage implements OnInit {
  selectedType: string = '';
  numberOfPeriods: number | null = null;
  results: { [key: string]: number | null } = {};
  availableCurrencyPairs: string[] = [];
  currencyPairs: { [key: string]: boolean } = {};
  isLoading: boolean = false; 
  error: string | null = null;

  constructor(private roboService: RoboService) {
    this.availableCurrencyPairs = this.roboService.currencyPairs;
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  } 
  ngOnInit() {
  }

  updateSelectedPairs(pair: string) {
    // Implemente aqui a lógica para manter apenas até 5 pares de moedas selecionados, se necessário
  }

  calculateMovingAverage() {
    if (this.numberOfPeriods && this.selectedType) {
      this.isLoading = true;
      Object.keys(this.currencyPairs).forEach((pair) => {
        if (this.currencyPairs[pair]) {
          this.roboService.updateMovingAverage(pair, this.selectedType, Number(this.numberOfPeriods));
          this.results[pair] = this.roboService.getMovingAverage(pair);
        }
      });
      this.isLoading = false;
    } else {
      this.error = 'Por favor, selecione todos os campos necessários.';
    }
  }
}
