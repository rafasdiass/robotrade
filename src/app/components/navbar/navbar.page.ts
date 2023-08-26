import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.page.html',
  styleUrls: ['./navbar.page.scss'],
})
export class NavbarPage implements OnInit {

  constructor(private router: Router) { }

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
}
