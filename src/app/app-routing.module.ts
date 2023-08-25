import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardPageModule)
  },
  
  
  {
    path: 'live-feed',
    loadChildren: () => import('./components/live-feed/live-feed.module').then(m => m.LiveFeedPageModule)
  },
  
  {
    path: 'robo-signals',
    loadChildren: () => import('./robo/robo-signals/robo-signals.module').then(m => m.RoboSignalsPageModule)
  },
  
  
  {
    path: 'soros-strategy',
    loadChildren: () => import('./trading-strategies/soros-strategy/soros-strategy.module').then( m => m.SorosStrategyPageModule)
  },
  {
    path: 'compound-interest',
    loadChildren: () => import('./trading-strategies/compound-interest/compound-interest.module').then( m => m.CompoundInterestPageModule)
  },
  {
    path: 'simple-interest',
    loadChildren: () => import('./trading-strategies/simple-interest/simple-interest.module').then( m => m.SimpleInterestPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
