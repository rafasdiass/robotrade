import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MovingAverageSetting } from "../../models/MovingAverageSetting.model";
import { RoboService } from '../../services/robo.service';
import { CurrencyPairService } from '../../services/currency-pair.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {
  movingAverageSettings: MovingAverageSetting[] = [];
  movingAverageForm: FormGroup;
  subscriptions: Subscription[] = [];
  currencyPairs: string[] = [];

  constructor(
    private roboService: RoboService, 
    private fb: FormBuilder,
    private currencyPairService: CurrencyPairService
  ) {
    this.movingAverageForm = this.fb.group({
      selectedType: ['', Validators.required],
      numberOfPeriods: [null, [Validators.required, Validators.min(1)]],
      currencyPairs: this.fb.array([], [Validators.required, Validators.maxLength(5)])
    });
  }

  ngOnInit() {
    const currencyPairsSubscription = this.currencyPairService.currencyPairs$.subscribe(pairs => {
      this.currencyPairs = pairs;
    });
    this.subscriptions.push(currencyPairsSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get currencyPairsFormArray() {
    return this.movingAverageForm.get('currencyPairs') as FormArray;
  }

  addMovingAverage() {
    if (this.movingAverageForm.valid) {
      const { selectedType, numberOfPeriods, currencyPairs } = this.movingAverageForm.value;
      this.movingAverageSettings.push({ type: selectedType, periods: numberOfPeriods, currencyPairs });
      // Update RoboService here
    } else {
      // Feedback to the user about invalid fields
    }
  }

  removeMovingAverage(index: number) {
    this.movingAverageSettings.splice(index, 1);
    // Update RoboService here
  }
}
