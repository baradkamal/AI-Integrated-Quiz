import { Component, OnInit, inject, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { QuizServiceService } from '../../../../core/services/quiz-service.service';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { GenAiApiService } from '../../../../core/services/gen-ai-api.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { UserResponse } from '../../../../interfaces/user-response';

@Component({
  selector: 'app-my-quizzes',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './my-quizzes.component.html',
  styleUrls: ['./my-quizzes.component.css']
})
export class MyQuizzesComponent implements OnInit {
  userResponses: UserResponse[] = [];
  isLoading = true;
  error: string | null = null;
  userId: string = '';
  dashboardData: any = {};
  dashboardLoading = true;
  showPopup = false;
  selectedResponse: UserResponse | null = null;
  quizDetailLoading = false;
  aiReviewData: any = null;
  selectedAnswerIndex: number = 0;

  constructor(
    private quizService: QuizServiceService,
    private dashboardService: DashboardService,
    private genAiApiService: GenAiApiService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const storedUserId = localStorage.getItem('user_id');
      if (storedUserId) {
        this.userId = storedUserId;
      }
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUserResponses();
      this.loadDashboardData();
      
    }
  }

  

  loadUserResponses() {
    if (!this.userId) {
      this.error = 'User ID not found';
      this.isLoading = false;
      return;
    }

    this.quizService.getUserResponses(this.userId).subscribe({
      next: (responses) => {
        this.userResponses = responses;
        this.isLoading = false;
       // console.log(this.userResponses);
      },
      error: (error) => {
        console.error('Error loading user responses:', error);
        this.error = 'Failed to load quiz history';
        this.isLoading = false;
      }
    });
  }
  
  loadDashboardData() {
    if (!this.userId) {
      this.dashboardLoading = false;
      return;
    }
    
    this.dashboardService.getUserDashboardStats(this.userId).subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.dashboardLoading = false;
        //console.log('Dashboard data:', data);
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.dashboardLoading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'started':
        return 'bg-yellow-100 text-yellow-800';
      case 'abandoned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  

  
 
  
  
  
  getTotalCorrectAnswers(responses: any[]): number {
    return responses.filter(resp => resp.isCorrect).length;
  }
  
  getScorePercentage(score: number, totalQuestions: number): number {
    if (totalQuestions === 0) return 0;
    return (score / totalQuestions) * 100;
  }
  
  getAnswerStatusClass(isCorrectOrAnswer: boolean | string): string {
    if (typeof isCorrectOrAnswer === 'boolean') {
      return isCorrectOrAnswer ? 'text-green-600' : 'text-red-600';
    }
    // If it's a string (correctAnswer), always return green
    return 'text-green-600';
  }
}
