import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginobj: any = {
    "email": "",
    "password": ""
  }

  router = inject(Router)
  http = inject(HttpClient); 
  constructor(private auth: AuthService) {}

  onSubmit() {
    this.auth.login(this.loginobj).subscribe({
      next: (response) => {
        
        this.auth.setToken(response.token);
        this.auth.setId(response._id);
        this.auth.setEmail(response.email);
        const isAdmin = response.admin;
        if (isAdmin) {
          this.router.navigateByUrl("deshboard");  
        } else {
          this.router.navigateByUrl("home");  
        }
      },
      error: (error) => {
        console.error('Login failed:', error.error.message);
      },
    });

  }
}
