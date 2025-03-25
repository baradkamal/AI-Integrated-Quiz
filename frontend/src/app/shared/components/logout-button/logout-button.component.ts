import { Component } from '@angular/core';
import { LogoutService } from '../../../core/services/logout.service';

@Component({
  selector: 'logout-button',
  standalone: true,
  templateUrl: './logout-button.component.html',
  styleUrls: ['./logout-button.component.css']
})
export class LogoutButtonComponent {

  constructor(private logoutService: LogoutService) {}

  onLogoff() {
    
    this.logoutService.onLogoff();
  }
}
