
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { TradingStrategiesPageModule } from '../trading-strategies/trading-strategies.module';
import { RoboSignalsPageModule } from '../robo-signals/robo-signals.module';
import { NavbarPageModule } from './../navbar/navbar.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    TradingStrategiesPageModule,
    RoboSignalsPageModule,
    NavbarPageModule
  ],
  declarations: [DashboardPage],
  exports : [DashboardPage]
})
export class DashboardPageModule {}
