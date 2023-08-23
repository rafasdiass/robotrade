import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { RoboSignalsPage } from '../robo-signals/robo-signals.page';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.page.html',
  styleUrls: ['./navbar.page.scss'],
})
export class NavbarPage implements OnInit {

  constructor(private router: Router, private popoverController: PopoverController) { }

  ngOnInit() {
  }

  openSettings() {
    this.router.navigate(['/settings']);
  }

  async openRoboSignals(ev: any) {
    const popover = await this.popoverController.create({
      component: RoboSignalsPage,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  // Methods to navigate to the new pages
  openSorosStrategy() {
    this.router.navigate(['/soros-strategy']);
  }

  openBankManagement() {
    this.router.navigate(['/bank-management']);
  }
}
