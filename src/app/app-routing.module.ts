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
    path: 'trade-history',
    loadChildren: () => import('./components/trade-history/trade-history.module').then(m => m.TradeHistoryPageModule)
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
    path: 'coins',
    loadChildren: () => import('./components/coins/coins.module').then(m => m.CoinsPageModule)
  },
  
  {
    path: 'soros-strategy',
    loadChildren: () => import('./trading-strategies/soros-strategy/soros-strategy.module').then( m => m.SorosStrategyPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
