import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MartingalePage } from './martingale.page';

const routes: Routes = [
  {
    path: '',
    component: MartingalePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MartingalePageRoutingModule {}
