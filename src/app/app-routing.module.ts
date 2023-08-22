import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { NavbarComponent } from './components/navbar/navbar.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'navbar',
    component: NavbarComponent
  },
  {
    path: 'trade-history',
    loadChildren: () => import('./components/trade-history/trade-history.module').then( m => m.TradeHistoryPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./components/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'live-feed',
    loadChildren: () => import('./components/live-feed/live-feed.module').then( m => m.LiveFeedPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./components/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'trading-strategies',
    loadChildren: () => import('./components/trading-strategies/trading-strategies.module').then( m => m.TradingStrategiesPageModule)
  },
  {
    path: 'robo-signals',
    loadChildren: () => import('./components/robo-signals/robo-signals.module').then( m => m.RoboSignalsPageModule)
  },
  {
    path: 'coins',
    loadChildren: () => import('./components/coins/coins.module').then( m => m.CoinsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
