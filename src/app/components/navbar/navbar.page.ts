import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importe o Router
import { PopoverController } from '@ionic/angular'; // Importe o PopoverController
import { RoboSignalsPage } from '../robo-signals/robo-signals.page'; // Importe o seu componente RoboSignalsPage

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.page.html',
  styleUrls: ['./navbar.page.scss'],
})
export class NavbarPage implements OnInit {

  constructor(private router: Router, private popoverController: PopoverController) { } // Injete o Router e o PopoverController

  ngOnInit() {
  }

  openSettings() {
    this.router.navigate(['/settings']); // Navegue para a página de configurações
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
