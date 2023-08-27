import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services-login/auth-service'; // Certifique-se do caminho correto aqui

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private navCtrl: NavController, private authService: AuthService) { }

  ngOnInit() {
  }

  async login() {
    try {
      await this.authService.signInWithGoogle();
      this.navCtrl.navigateForward('/dashboard');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  }

  logout() {
    this.authService.signOut();
  }

}
