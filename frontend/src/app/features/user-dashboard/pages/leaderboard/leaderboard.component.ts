import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { LeaderboardService } from '../../../../core/services/leaderboard.service';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent implements OnInit {
  quizLeaderboard: any[] = [];
  overallLeaderboard: any[] = [];
  loading: boolean = true;
  error: string | null = null;
  currentUserId: string | null = null;

  constructor(
    private leaderboardService: LeaderboardService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUserId = localStorage.getItem('user_id');
    }
    this.loadLeaderboards();
  }

  loadLeaderboards() {
    this.loading = true;
    this.error = null;

    // Load quiz leaderboard for a specific quiz
    this.leaderboardService.getQuizLeaderboard('67e2a25db76da0ec103902c8').subscribe({
      next: (data) => {
        this.quizLeaderboard = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading quiz leaderboard:', err);
        this.error = 'Failed to load quiz leaderboard';
        this.loading = false;
      }
    });

    // Load overall leaderboard
    this.leaderboardService.getOverallLeaderboard().subscribe({
      next: (data) => {
        this.overallLeaderboard = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading overall leaderboard:', err);
        this.error = 'Failed to load overall leaderboard';
        this.loading = false;
      }
    });
  }

  isCurrentUser(userId: string): boolean {
    return this.currentUserId === userId;
  }
}

