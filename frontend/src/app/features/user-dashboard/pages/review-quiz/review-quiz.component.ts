import { Component, OnInit, inject, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserResponse } from '../../../../interfaces/user-response';
import { QuizServiceService } from '../../../../core/services/quiz-service.service';
import { UserServiceService } from '../../../../core/services/user-service.service';
import { GenAiApiService } from '../../../../core/services/gen-ai-api.service';

@Component({
  selector: 'app-review-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-quiz.component.html',
  styleUrl: './review-quiz.component.css'
})
export class ReviewQuizComponent implements OnInit {
  responseId: string = '';
  userResponses: UserResponse[] = [];
  selectedResponse: UserResponse | null = null;
  isLoading: boolean = true;
  error: string | null = null;
  userId: string = '';
  aiReviewData: any = null;
  selectedAnswerIndex: number = 0;
  activeDiv: string = 'form1';

  constructor(
    private quizService: QuizServiceService,
    private userService: UserServiceService,
    private genAiApiService: GenAiApiService,
    private route: ActivatedRoute,
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
      // Get the response ID from the route parameters
      this.route.params.subscribe(params => {
        this.responseId = params['id'];
        this.loadUserResponses();
      });
    }
  }

  loadUserResponses() {
    if (!this.userId) {
      this.error = 'User ID not found';
      this.isLoading = false;
      return;
    }

    this.userService.finduserresponsebyid(this.userId).subscribe({
      next: (responses) => {
        this.userResponses = responses;
        this.findSelectedResponse();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user responses:', error);
        this.error = 'Failed to load quiz history';
        this.isLoading = false;
      }
    });
  }

  findSelectedResponse() {
    // Find the response that matches the ID from the URL
    this.selectedResponse = this.userResponses.find(resp => resp._id === this.responseId) || null;
    
    if (!this.selectedResponse) {
      this.error = 'Quiz response not found';
    }
  }

  reviewAnswer(index: number = 0) {
    this.selectedAnswerIndex = index;
    
    if (this.selectedResponse && this.selectedResponse.responses.length > 0) {
      const responseItem = this.selectedResponse.responses[this.selectedAnswerIndex];
      
      // Show loading state
      this.aiReviewData = { loading: true };
      
      this.genAiApiService.reviewAnswer(
        responseItem.correctAnswer,
        responseItem.question.question,
        responseItem.userAnswer
      ).subscribe({
        next: (data) => {
          this.aiReviewData = data;
          this.toggleDiv();
        },
        error: (error) => {
          console.error('Error reviewing answer:', error);
          this.aiReviewData = { 
            error: true, 
            message: 'Failed to get AI explanation.' 
          };
        }
      });
    }
  }

  toggleDiv() {
    this.activeDiv = this.activeDiv === 'form1' ? 'form2' : 'form1';
  }
  
  getAnswerStatusClass(isCorrectOrAnswer: boolean | string): string {
    if (typeof isCorrectOrAnswer === 'boolean') {
      return isCorrectOrAnswer ? 'text-green-600' : 'text-red-600';
    }
    // If it's a string (correctAnswer), always return green
    return 'text-green-600';
  }
  
  getTotalCorrectAnswers(responses: any[]): number {
    return responses.filter(resp => resp.isCorrect).length;
  }
  
  getScorePercentage(score: number, totalQuestions: number): number {
    if (totalQuestions === 0) return 0;
    return (score / totalQuestions) * 100;
  }

  goBack() {
    this.router.navigate(['/myquizzes']);
  }
}
