import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MovingAveragePageRoutingModule } from './moving-average-routing.module';

import { MovingAveragePage } from './moving-average.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MovingAveragePageRoutingModule
  ],
  declarations: [MovingAveragePage]
})
export class MovingAveragePageModule {}
