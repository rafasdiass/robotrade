import { Component, OnInit } from '@angular/core';
import { RoboService } from '../../../services/robo.service';
import { CurrencyPairService } from '../../../services/currency-pair.service';

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

  constructor(
    private roboService: RoboService,
    private currencyPairService: CurrencyPairService
  ) {
    // Subscribe to currency pair updates from CurrencyPairService
    this.currencyPairService.currencyPairs$.subscribe((pairs) => {
      this.availableCurrencyPairs = pairs;
      pairs.forEach(pair => this.currencyPairs[pair] = false);
    });
  }

  ngOnInit() {
    // Initialization logic here
  }

  // Update selected currency pairs
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

  // Getter for object keys
  get objectKeys() {
    return Object.keys(this.currencyPairs);
  }

  // Calculate moving average
  calculateMovingAverage() {
    if (this.numberOfPeriods && this.selectedType) {
      this.isLoading = true;
      const selectedPairs = Object.keys(this.currencyPairs).filter((pair) => this.currencyPairs[pair]);

      // Prepare settings for moving average calculation
      const settings = {
        currencyPairs: selectedPairs,
        type: this.selectedType,
        periods: Number(this.numberOfPeriods),
      };

      // Make sure these methods exist in your RoboService
      this.roboService.setMovingAverageSettings([settings]);
      this.roboService.evaluateIndicators(); // Assuming this method is public in your RoboService

      this.isLoading = false;
    } else {
      this.error = 'Por favor, selecione todos os campos necessários.';
    }
  }
}
