import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LiveFeedPageRoutingModule } from './live-feed-routing.module';

import { LiveFeedPage } from './live-feed.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LiveFeedPageRoutingModule
  ],
  declarations: [LiveFeedPage]
})
export class LiveFeedPageModule {}
