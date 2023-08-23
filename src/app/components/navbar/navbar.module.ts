import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NavbarPageRoutingModule } from './navbar-routing.module';

import { NavbarPage } from './navbar.page';
import { SettingsPageModule } from '../../robo/settings/settings.module';
import { SorosStrategyPageModule } from 'src/app/trading-strategies/soros-strategy/soros-strategy.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NavbarPageRoutingModule,
    SettingsPageModule,
    SorosStrategyPageModule
  ],
  declarations: [NavbarPage],
  exports: [NavbarPage]
})
export class NavbarPageModule {}
