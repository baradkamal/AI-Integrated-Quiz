import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserServiceService } from '../../../../core/services/user-service.service';
import { ImageUrlService } from '../../../../core/services/image-url.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  currentUserId: string | null = null;
  userData: any;
  profileImageUrl: string = '/assets/images/default-profile.png';

  constructor(
    private userService: UserServiceService,
    private imageUrlService: ImageUrlService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUserId = localStorage.getItem('user_id');
      this.loadUserProfile();
    }
  }

  loadUserProfile() {
    if (this.currentUserId) {
      this.userService.getUserprofile(this.currentUserId).subscribe({
        next: (response) => {
          this.userData = response;
          if (this.userData?.profileImage) {
            this.profileImageUrl = this.imageUrlService.getFullImageUrl(this.userData.profileImage);
          }
        },
        error: (error) => {
          console.error('Error loading user profile:', error);
        }
      });
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = '/assets/images/default-profile.png';
    }
  }
}