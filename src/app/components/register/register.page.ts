import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services-login/auth-service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      displayName: ['', Validators.required]
    });
  }

  ngOnInit() {}

  async register() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      try {
        const firebaseUser = await this.authService.register(formValue.email, formValue.password, formValue.displayName);
        if (firebaseUser) {
          console.log('Registration successful');
          this.router.navigate(['/login']);
        }
      } catch (error: any) {
        console.log(error);
        this.errorMessage = error.message;
      }
    } else {
      this.errorMessage = 'Please fill out all fields correctly.';
    }
  }

  login() {
    this.router.navigate(['/login']);
  }
}
