import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePagePageRoutingModule } from './home-page-routing.module';

import { HomePagePage } from './home-page.page';
import { NavbarPageModule } from '../components/navbar/navbar.module';
import { DashboardPageModule } from '../components/dashboard/dashboard.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePagePageRoutingModule,
    NavbarPageModule, 
    DashboardPageModule
  ],
  declarations: [HomePagePage]
})
export class HomePagePageModule {}
