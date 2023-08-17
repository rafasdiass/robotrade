import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TradeHistoryPage } from './trade-history.page';

const routes: Routes = [
  {
    path: '',
    component: TradeHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TradeHistoryPageRoutingModule {}
