import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Login } from '../modules/login.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  loginForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required]) // Uklonjen minLength za testiranje
  });
  
  login(): void {
    if (!this.loginForm.valid) {
      console.error('Form validation errors:', this.loginForm.errors);
    }
  
    const login: Login = {
      email: this.loginForm.value.email || "",
      password: this.loginForm.value.password || "",
    };
  
    if (this.loginForm.valid) {
      this.authService.login(login).subscribe({
        next: (token) => {
          localStorage.setItem("jwt", token.token);
          this.router.navigate(['/app-daily-stats']);
        },
        error: (err) => {
          console.error('Login failed:', err);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
  

  logout(): void {
    this.authService.logout();
    localStorage.removeItem("jwt");
    this.router.navigate(['/login']);
  }
  
}
