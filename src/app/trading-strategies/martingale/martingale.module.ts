import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MartingalePageRoutingModule } from './martingale-routing.module';

import { MartingalePage } from './martingale.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MartingalePageRoutingModule
  ],
  declarations: [MartingalePage]
})
export class MartingalePageModule {}
