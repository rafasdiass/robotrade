import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services-login/auth-service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {}

  login() {
    if (this.loginForm.valid) {
      const formValue = this.loginForm.value;
      this.authService.signIn(formValue.email, formValue.password).then(
        () => {
          this.router.navigate(['/dashboard']);
          console.log('Login successful');  
        
        },
        (error: any) => {
          console.log(error);
          this.errorMessage = error.message;
        }
      );
    } else {
      this.router.navigate(['/register']);
    }
  }

  register() {
    this.router.navigate(['/register']);
  }
  logout() {
    this.authService.signOut().then(() => {
      console.log('Logout successful');
      this.router.navigate(['/login']);  // Redireciona para a página de login após o logout
    }).catch((error) => {
      console.error('Logout failed', error);
    });
  }
}
