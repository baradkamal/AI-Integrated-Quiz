import { Component, ElementRef, HostListener, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { UserServiceService } from '../../../core/services/user-service.service';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { error } from 'console';

@Component({
  selector: 'app-nevbar',
  imports: [CommonModule,RouterOutlet],
  templateUrl: './nevbar.component.html',
  styleUrl: './nevbar.component.css'
})
export class NevbarComponent implements OnInit {
  isUserPanelVisible: boolean = false;
  userId: string | null = null;
  userName: string = '';

  constructor(
    private eRef: ElementRef,
    private userService: UserServiceService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.userId = localStorage.getItem('user_id');
      this.getusernamebyid();
    }
  }

  getusernamebyid()
  {
    this.userService.finduserbyid(this.userId).subscribe({
      next: (response) => {
          this.userName = response.name;
      }, error: (error) => {
          console.error('error fetching user name', error);
      }
    })
  }

  
  toggleUserPanel() {
    this.isUserPanelVisible = !this.isUserPanelVisible;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isUserPanelVisible = false;
    }
  }

  onLogoff() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_id');
    }
    this.router.navigateByUrl("login");
  }
}
