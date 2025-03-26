import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'logout-button',
  standalone: true,
  templateUrl: './logout-button.component.html',
  styleUrls: ['./logout-button.component.css']
})
export class LogoutButtonComponent {

  constructor(private router: Router) {}

  onLogoff() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_id');
    this.router.navigateByUrl("login");
  }
}
