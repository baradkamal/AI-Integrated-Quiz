import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  RegisterObj: any = 
    {
      "name": "",
      "email":"", 
      "age": "" , 
      "username": "", 
      "password": "",
      "confirmPassword": "" 
    }
    router = inject(Router)
    http = inject(HttpClient);
    constructor(private auth: AuthService) {}

    isPasswordMatch(): boolean {
      return this.RegisterObj.password === this.RegisterObj.confirmPassword;
    }

    onSubmit() {
      if (!this.isPasswordMatch()) {
        console.log('Passwords do not match!');
        return;
      }
      
      const { confirmPassword, ...dataToSend } = this.RegisterObj;

      this.auth.register(dataToSend).subscribe({
        next: (res) => {
          this.router.navigate(['/login']);
        }
        ,error: (error) =>{
          console.log('register Failed: ',error);
        },
      })
    }
}
