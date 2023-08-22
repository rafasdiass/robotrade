import { Component, OnInit } from '@angular/core';
import { RoboService } from '../../services/robo.service';

@Component({
  selector: 'app-robo-signals',
  templateUrl: './robo-signals.page.html',
  styleUrls: ['./robo-signals.page.scss'],
})
export class RoboSignalsPage implements OnInit {

  currentPredictions: { [key: string]: string } = {};

  constructor(private roboService: RoboService) {
    // Se inscreve no BehaviorSubject para obter as últimas previsões
    this.roboService.predictions$.subscribe(predictions => {
      this.currentPredictions = predictions;
    });
  }

  ngOnInit() {
  }
}
