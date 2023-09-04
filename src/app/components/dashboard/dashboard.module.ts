
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';

import { RoboSignalsPageModule } from '../../robo/robo-signals/robo-signals.module';
import { NavbarPageModule } from './../navbar/navbar.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
   
    RoboSignalsPageModule,
    NavbarPageModule
  ],
  declarations: [DashboardPage],
  exports : [DashboardPage]
})
export class DashboardPageModule {}
