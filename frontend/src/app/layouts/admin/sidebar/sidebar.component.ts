import { Component, HostListener, Inject, ElementRef, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterOutlet,Router, RouterLinkActive } from '@angular/router';
import { UserServiceService } from '../../../core/services/user-service.service';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-sidebar',
  imports: [RouterLink , RouterOutlet, CommonModule, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isOpen = true; // Sidebar state on desktop, defaults to open
  isMobile = false; // Track if we're on mobile
  isUserPanelVisible = false;
  userId: string | null = null;
  userName: string = '';// Replace with actual user name from your auth service
  
  constructor(
    private eRef: ElementRef,
    private userService: UserServiceService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    
    this.checkScreenSize();
    
  }
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


  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }
  
  checkScreenSize() {
    this.isMobile = window.innerWidth < 1024; // 1024px is the lg breakpoint in Tailwind
    // Close sidebar on mobile by default
    if (this.isMobile && this.isOpen) {
      this.isOpen = false;
    } else if (!this.isMobile && !this.isOpen) {
      
      this.isOpen = true;
    }
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
  
  toggleUserPanel() {
    this.isUserPanelVisible = !this.isUserPanelVisible;
  }
  
  onLogoff() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_id');
    }
    this.router.navigateByUrl("login");
  }
  
  // Close user panel when clicking outside
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isUserPanelVisible = false;
      this.isOpen = false;
    }
  }
}
