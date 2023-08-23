import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovingAveragePage } from './moving-average.page';

const routes: Routes = [
  {
    path: '',
    component: MovingAveragePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MovingAveragePageRoutingModule {}
