import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NavbarPageRoutingModule } from './navbar-routing.module';

import { NavbarPage } from './navbar.page';

import { SorosStrategyPageModule } from 'src/app/trading-strategies/soros-strategy/soros-strategy.module';
import { RoboSignalsPageModule } from 'src/app/robo/robo-signals/robo-signals.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NavbarPageRoutingModule,
    RoboSignalsPageModule,
    
    SorosStrategyPageModule
  ],
  declarations: [NavbarPage],
  exports: [NavbarPage]
})
export class NavbarPageModule {}
