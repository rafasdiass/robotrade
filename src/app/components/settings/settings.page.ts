import { Component, OnInit } from '@angular/core';
import { RoboService } from '../../services/robo.service';
import { MovingAverageSetting } from "../../models/MovingAverageSetting.model";


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  // Array para manter as configurações de média móvel
  movingAverageSettings: MovingAverageSetting[] = [];
  
  // Propriedades para armazenar as seleções do usuário no formulário
  selectedType: string = '';
  numberOfPeriods: number | null;
  currencyPair: string = '';

  constructor(private roboService: RoboService) {
    // Inicializando as novas propriedades
    this.selectedType = '';
    this.numberOfPeriods = null;
    this.currencyPair = '';
  }

  ngOnInit() { }

  // Adiciona uma nova configuração de média móvel
  addMovingAverage() {
    if (this.selectedType && this.numberOfPeriods !== null && this.currencyPair) {
      this.movingAverageSettings.push({ 
        type: this.selectedType, 
        periods: this.numberOfPeriods, 
        currencyPair: this.currencyPair 
      });
      this.updateRoboService();
    } else {
      // Trate o caso em que nem todos os campos estão preenchidos, se necessário
    }
  }

  // Remove uma configuração de média móvel
  removeMovingAverage(index: number) {
    this.movingAverageSettings.splice(index, 1);
    this.updateRoboService();
  }

  // Atualiza as configurações no RoboService
  updateRoboService() {
    // Aqui você pode chamar métodos no RoboService para atualizar as configurações
    // por exemplo, this.roboService.setMovingAverageSettings(this.movingAverageSettings);
  }
}
