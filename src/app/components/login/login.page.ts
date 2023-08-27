import { Component, OnInit } from '@angular/core';
import { Auth, getAuth, signInWithPopup, GoogleAuthProvider, signOut } from '@angular/fire/auth';
import { AuthService } from '../../services-login/auth-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private auth: Auth, private authService: AuthService) { }

  ngOnInit() {
  }

  login() {
    this.authService.signInWithGoogle();
  }
  
  logout() {
    this.authService.signOut();
  }

}