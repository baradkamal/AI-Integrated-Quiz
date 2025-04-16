import { Component, ElementRef, HostListener, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { UserServiceService } from '../../../core/services/user-service.service';
import { ImageUrlService } from '../../../core/services/image-url.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-nevbar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './nevbar.component.html',
  styleUrl: './nevbar.component.css'
})
export class NevbarComponent implements OnInit {
  isUserPanelVisible: boolean = false;
  userId: string | null = null;
  userName: string = '';
  profileImage: string = '/assets/images/default-profile.png'; // Default image

  constructor(
    private eRef: ElementRef,
    private userService: UserServiceService,
    private imageUrlService: ImageUrlService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.userId = localStorage.getItem('user_id');
      if (this.userId) {
        this.getusernamebyid();
      }
    }
  }

  getusernamebyid() {
    this.userService.finduserbyid(this.userId).subscribe({
      next: (response) => {
        this.userName = response.name;
        if (response.profileImage) {
          this.profileImage = this.imageUrlService.getFullImageUrl(response.profileImage);
        }
      },
      error: (error) => {
        console.error('error fetching user name', error);
      }
    });
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

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = '/assets/images/default-profile.png';
    }
  }
}
