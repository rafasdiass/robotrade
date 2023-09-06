import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services-login/auth-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.page.html',
  styleUrls: ['./navbar.page.scss'],
})
export class NavbarPage implements OnInit {

  isLoggedIn = false;

  constructor(private router: Router, private navCtrl: NavController, private authService: AuthService) { }

  ngOnInit() {
  }

  openRoboSignals() {
    this.router.navigate(['/robo-signals']);
  }

  openSorosStrategy() {
    this.router.navigate(['/martingale']);
  }

  openBankManagement() {
    this.router.navigate(['/simple-interest']);
  }

  openCompoundInterest() {
    this.router.navigate(['/compound-interest']);
  }

  openLogin() {
    this.router.navigate(['/login']);
  }

  async toggleAuthentication() {
    if (this.isLoggedIn) {
      this.authService.signOut();
      this.isLoggedIn = false;
      this.navCtrl.navigateRoot('/login');
    // } else {
    //   await this.authService.signInWithGoogle();
    //   this.isLoggedIn = true;
    //   this.navCtrl.navigateForward('/dashboard');
    // }
  }
  
}


}