import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizServiceService } from '../../../../core/services/quiz-service.service';
import { Router } from '@angular/router';

interface UserResponse {
  _id: string;
  user: string;
  quiz: {
    _id: string;
    title: string;
    category: {
      name: string;
    };
    difficulty: {
      name: string;
    };
  };
  responses: Array<{
    question: string;
    userAnswer: string;
    isCorrect: boolean;
    points: number;
    _id: string;
  }>;
  totalScore: number;
  status: 'started' | 'completed' | 'abandoned';
  completedAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

@Component({
  selector: 'app-my-quizzes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-quizzes.component.html',
  styleUrls: ['./my-quizzes.component.css']
})
export class MyQuizzesComponent implements OnInit {
  userResponses: UserResponse[] = [];
  isLoading = true;
  error: string | null = null;
  userId: string = '';

  constructor(
    private quizService: QuizServiceService,
    private router: Router
  ) {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      this.userId = storedUserId;
    }
  }

  ngOnInit(): void {
    this.loadUserResponses();
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
        console.log(this.userResponses);
      },
      error: (error) => {
        console.error('Error loading user responses:', error);
        this.error = 'Failed to load quiz history';
        this.isLoading = false;
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

  

  viewQuizDetails(quizId: string) {
    console.log(quizId);
  }
}
