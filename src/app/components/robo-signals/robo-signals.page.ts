import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoboService } from '../../services/robo.service';

interface RobotSignal {
  time: string;
  action: string;
  currencyPair: string;
}

@Component({
  selector: 'app-robo-signals',
  templateUrl: './robo-signals.page.html',
  styleUrls: ['./robo-signals.page.scss'],
})
export class RoboSignalsPage implements OnInit, OnDestroy {
  currentPredictions: { [key: string]: string } = {};
  robotSignals: RobotSignal[] = [];
  predictionsSubscription!: Subscription;

  constructor(private roboService: RoboService) {}

  ngOnInit() {
    this.predictionsSubscription = this.roboService.predictions$.subscribe(predictions => {
      console.log("Predictions updated: ", predictions);
      this.currentPredictions = predictions;

      // Assuming predictions include action and currencyPair
      this.robotSignals = Object.keys(predictions).map(currencyPair => ({
        time: new Date().toLocaleTimeString(),
        action: predictions[currencyPair],
        currencyPair
      }));
    });
  }

  ngOnDestroy() {
    this.predictionsSubscription.unsubscribe();
  }
}
