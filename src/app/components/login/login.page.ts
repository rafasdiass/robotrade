import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services-login/auth-service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User as FirebaseUser } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,  // Usando o novo AuthService
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {}

  async login() {
    if (this.loginForm.valid) {
      const formValue = this.loginForm.value;
      try {
        const firebaseUser: FirebaseUser = await this.authService.signIn(formValue.email, formValue.password);
        if (firebaseUser) {
          this.router.navigate(['/dashboard']);
          console.log('Login successful');
        }
      } catch (error: any) {  // Especificando o tipo como 'any'
        console.error(error);
        this.errorMessage = error.message;
      }
    } else {
      this.router.navigate(['/register']);
    }
  }

  register() {
    this.router.navigate(['/register']);
  }

  async logout() {
    try {
      await this.authService.signOut();
      console.log('Logout successful');
      this.router.navigate(['/login']);
    } catch (error: any) {  // Especificando o tipo como 'any'
      console.error('Logout failed', error);
    }
  }

  async socialLogin(platform: string) {
    try {
      const firebaseUser: FirebaseUser = await this.authService.socialSignIn(platform);
      if (firebaseUser) {
        this.router.navigate(['/dashboard']);
        console.log(`Login social com ${platform} foi bem-sucedido`);
      }
    } catch (error: any) {
      console.error(`Login social com ${platform} falhou`, error);
    }
  }
}
