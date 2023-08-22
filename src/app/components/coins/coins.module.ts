import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoinsPageRoutingModule } from './coins-routing.module';

import { CoinsPage } from './coins.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoinsPageRoutingModule
  ],
  declarations: [CoinsPage]
})
export class CoinsPageModule {}
