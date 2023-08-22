import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoboSignalsPageRoutingModule } from './robo-signals-routing.module';

import { RoboSignalsPage } from './robo-signals.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoboSignalsPageRoutingModule
  ],
  declarations: [RoboSignalsPage]
})
export class RoboSignalsPageModule {}
