import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TradingStrategiesPageRoutingModule } from './trading-strategies-routing.module';

import { TradingStrategiesPage } from './trading-strategies.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TradingStrategiesPageRoutingModule
  ],
  declarations: [TradingStrategiesPage],
  exports: [TradingStrategiesPage]
})
export class TradingStrategiesPageModule {}
