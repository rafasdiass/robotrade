import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SorosStrategyPageRoutingModule } from './soros-strategy-routing.module';

import { SorosStrategyPage } from './soros-strategy.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SorosStrategyPageRoutingModule
  ],
  declarations: [SorosStrategyPage],
  exports : [SorosStrategyPage]
})
export class SorosStrategyPageModule {}
