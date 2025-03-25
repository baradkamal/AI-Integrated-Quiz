import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(private router: Router) { }

  onLogoff() {
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_id');
    
    
    this.router.navigateByUrl("login");
}

}
