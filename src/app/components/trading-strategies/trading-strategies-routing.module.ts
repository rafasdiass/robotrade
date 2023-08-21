import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TradingStrategiesPage } from './trading-strategies.page';

const routes: Routes = [
  {
    path: '',
    component: TradingStrategiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TradingStrategiesPageRoutingModule {}
