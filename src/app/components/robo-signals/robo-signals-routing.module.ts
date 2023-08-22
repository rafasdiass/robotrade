import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoboSignalsPage } from './robo-signals.page';

const routes: Routes = [
  {
    path: '',
    component: RoboSignalsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoboSignalsPageRoutingModule {}
