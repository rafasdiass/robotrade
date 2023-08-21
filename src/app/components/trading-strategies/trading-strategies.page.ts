import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-trading-strategies',
  templateUrl: './trading-strategies.page.html',
  styleUrls: ['./trading-strategies.page.scss'],
})
export class TradingStrategiesPage implements OnInit {
  selectedStrategy!: string; // Variável para guardar a estratégia selecionada

  @Output() strategyChanged = new EventEmitter<string>();

  constructor() { }

  ngOnInit() { }

  onStrategyChange() {
    this.strategyChanged.emit(this.selectedStrategy);
  }
}
