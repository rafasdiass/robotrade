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
    this.roboService.currencyPairs$.subscribe((pairs) => {
      this.availableCurrencyPairs = pairs;
      pairs.forEach(pair => this.currencyPairs[pair] = false);
    });
  }

  ngOnInit() {
  }

  updateSelectedPairs(pair: string) {
    if (this.currencyPairs[pair]) {
      this.currencyPairs[pair] = false;
    } else {
      const selectedCount = Object.values(this.currencyPairs).filter(val => val).length;
      if (selectedCount < 5) {
        this.currencyPairs[pair] = true;
      }
    }
  }

  get objectKeys() {
    return Object.keys(this.currencyPairs);
  }

  calculateMovingAverage() {
    if (this.numberOfPeriods && this.selectedType) {
      this.isLoading = true;
      const selectedPairs = Object.keys(this.currencyPairs).filter((pair) => this.currencyPairs[pair]);

      const settings = {
        currencyPairs: selectedPairs,
        type: this.selectedType,
        periods: Number(this.numberOfPeriods),
      };

      this.roboService.setMovingAverageSettings([settings]); // Make sure 'setMovingAverageSettings' exists in your service
      this.roboService.triggerEvaluateIndicators(); // Make sure 'triggerEvaluateIndicators' exists in your service

      this.isLoading = false;
    } else {
      this.error = 'Por favor, selecione todos os campos necessários.';
    }
  }
}
