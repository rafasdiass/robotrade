import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TradeHistoryPageRoutingModule } from './trade-history-routing.module';

import { TradeHistoryPage } from './trade-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TradeHistoryPageRoutingModule
  ],
  declarations: [TradeHistoryPage]
})
export class TradeHistoryPageModule {}
