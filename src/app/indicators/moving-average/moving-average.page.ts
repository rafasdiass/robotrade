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
  result: number | null = null;
  currencyPair: string = 'USDJPY'; // Você pode permitir que o usuário selecione isso

  constructor(private roboService: RoboService) { }

  ngOnInit() {
  }

  calculateMovingAverage() {
    if (this.numberOfPeriods && this.selectedType) {
      this.roboService.updateMovingAverage(this.currencyPair, this.selectedType, Number(this.numberOfPeriods));
      this.result = this.roboService.getMovingAverage(this.currencyPair);
    }
  }
}
