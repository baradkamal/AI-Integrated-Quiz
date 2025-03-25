import { Component } from '@angular/core';
import { LogoutButtonComponent } from '../../../../shared/components/logout-button/logout-button.component';



@Component({
  selector: 'app-user-deshboard',
  imports: [LogoutButtonComponent],
  templateUrl: './user-deshboard.component.html',
  styleUrl: './user-deshboard.component.css'
})
export class UserDeshboardComponent {

  constructor() { }
  
  hello(){
    console.log("hello world");
  }
}
