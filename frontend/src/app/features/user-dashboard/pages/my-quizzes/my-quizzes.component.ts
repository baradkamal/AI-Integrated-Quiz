import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UserServiceService } from '../../../../core/services/user-service.service';
import { QuizServiceService } from '../../../../core/services/quiz-service.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-quizzes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-quizzes.component.html',
  styleUrl: './my-quizzes.component.css'
})
export class MyQuizzesComponent implements OnInit {
  userId: string | null = null;
  userQuizzes: any[] = [];
  quizzes: any[] = [];
  combinedData: any[] = []; 
  filteredQuizHistory: any[] = [];

  constructor(
    private userService: UserServiceService,
    private quizService: QuizServiceService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.userId = localStorage.getItem('user_id');
      if (this.userId) {
        this.fetchUserQuizzes(this.userId);
        this.filteredQuizHistory = this.combinedData;
      }
    }
  }

  fetchUserQuizzes(userId: string) {
    this.userService.finduserresponsebyid(userId).subscribe({
      next: (attempts) => {
        this.userQuizzes = attempts;
        const quizIds = [...new Set(this.userQuizzes.map((quiz) => quiz.quiz))]; // Ensure unique IDs
  
        if (quizIds.length > 0) {
          this.quizService.fetchquizbyids(quizIds).subscribe({
            next: (quizzes) => {
              this.quizzes = quizzes;
              this.mergeQuizData();
            },
            error: (error) => console.error('Error fetching quizzes:', error)
          });
        }
      },
      error: (error) => console.error('Error fetching user responses:', error)
    });
  }
  
  // Merging quiz details with user attempts
  mergeQuizData() {
    console.log('User Quizzes:', this.userQuizzes);
    console.log('Quizzes:', this.quizzes);
    
    this.combinedData = this.userQuizzes.map((attempt) => {
      const quizDetail = this.quizzes.find((q) => {
        const quizId = q._id.toString();
        const attemptQuizId = attempt.quiz.toString();
        console.log('Comparing:', quizId, attemptQuizId);
        return quizId === attemptQuizId;
      });

      console.log('Found quiz detail:', quizDetail);

      return {
        ...attempt,
        name: quizDetail?.title || 'Unknown Quiz',
        category: quizDetail?.categoryId || 'Unknown Category',
        difficulty: quizDetail?.difficultyId || 'Unknown',
        totalQuestions: attempt.responses.length,
        percentage: ((attempt.totalScore / attempt.responses.length) * 100).toFixed(2),
      };
    });
  }

  filterQuizHistory(event: Event) {
    const filterValue = (event.target as HTMLSelectElement).value;
    const now = new Date();

    if (filterValue === 'all') {
      this.filteredQuizHistory = this.combinedData;
    } else {
      const daysToFilter = parseInt(filterValue);
      this.filteredQuizHistory = this.combinedData.filter(attempt => {
        const attemptDate = new Date(attempt.completedAt);
        const daysDifference = (now.getTime() - attemptDate.getTime()) / (1000 * 3600 * 24);
        return daysDifference <= daysToFilter;
      });
    }
  }
  
  reviewQuiz(attempt: any) {
    
    console.log('Reviewing quiz', attempt);
  }
}
