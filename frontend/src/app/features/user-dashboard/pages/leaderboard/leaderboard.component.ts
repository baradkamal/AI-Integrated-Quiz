import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { QuizServiceService } from '../../../../core/services/quiz-service.service';
import { ImageUrlService } from '../../../../core/services/image-url.service';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent implements OnInit {
  quizLeaderboard: any[] = [];
  overallLeaderboard: any[] = [];
  loading: boolean = true;
  quizLoading: boolean = false;
  error: string | null = null;
  currentUserId: string | null = null;
  availableQuizzes: any[] = [];
  selectedQuizId: string = '';
  selectedQuizTitle: string = 'Select a Quiz';

  constructor(
    private dashboardService: DashboardService,
    private quizService: QuizServiceService,
    private imageUrlService: ImageUrlService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUserId = localStorage.getItem('user_id');
    }
    this.loadOverallLeaderboard();
    this.loadAvailableQuizzes();
  }

  loadOverallLeaderboard() {
    this.loading = true;
    this.error = null;

    // Load overall leaderboard
    this.dashboardService.getLeaderboard().subscribe({
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

  loadAvailableQuizzes() {
    this.quizService.fetchQuizzes().subscribe({
      next: (quizzes) => {
        // Filter only published quizzes
        this.availableQuizzes = quizzes.filter(quiz => quiz.status === 'published');
        
        // If we have quizzes, load the first one's leaderboard by default
        if (this.availableQuizzes.length > 0) {
          this.selectQuiz(this.availableQuizzes[0]._id, this.availableQuizzes[0].title);
        }
      },
      error: (err) => {
        console.error('Error loading quizzes:', err);
        this.error = 'Failed to load available quizzes';
      }
    });
  }

  selectQuiz(quizId: string, quizTitle: string) {
    this.selectedQuizId = quizId;
    this.selectedQuizTitle = quizTitle;
    this.loadQuizLeaderboard(quizId);
  }

  onQuizSelectionChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const quizId = selectElement.value;
    const quizTitle = selectElement.options[selectElement.selectedIndex].text;
    this.selectQuiz(quizId, quizTitle);
  }

  loadQuizLeaderboard(quizId: string) {
    this.quizLoading = true;
    
    this.dashboardService.getLeaderboard(quizId).subscribe({
      next: (data) => {
        this.quizLeaderboard = data;
        this.quizLoading = false;
      },
      error: (err) => {
        console.error('Error loading quiz leaderboard:', err);
        this.error = 'Failed to load quiz leaderboard';
        this.quizLoading = false;
      }
    });
  }

  isCurrentUser(userId: string): boolean {
    return this.currentUserId === userId;
  }

  getProfileImageUrl(relativePath: string | undefined): string {
    if (!relativePath) {
      return 'assets/images/default-avatar.png';
    }
    return this.imageUrlService.getFullImageUrl(relativePath);
  }
}

