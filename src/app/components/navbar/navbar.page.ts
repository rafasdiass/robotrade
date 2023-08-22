import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { SettingsPage } from '../settings/settings.page'; // Importe o seu componente SettingsPage
import { RoboSignalsPage } from '../robo-signals/robo-signals.page'; // Importe o seu componente RoboSignalsPage

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.page.html',
  styleUrls: ['./navbar.page.scss'],
})
export class NavbarPage implements OnInit {

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {
  }

  async openSettings(ev: any) {
    const popover = await this.popoverController.create({
      component: SettingsPage,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  async openRoboSignals(ev: any) {
    const popover = await this.popoverController.create({
      component: RoboSignalsPage,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }
}
