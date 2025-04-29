import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { NevbarComponent } from "../../../../layouts/user/nevbar/nevbar.component";
import { FormsModule } from '@angular/forms';
import { QuizServiceService } from '../../../../core/services/quiz-service.service';
import { DifficultyService } from '../../../../core/services/difficulty.service';
import { CategoryService } from '../../../../core/services/category.service';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { PlayQuizComponentComponent } from "../../components/play-quiz-component/play-quiz-component.component";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-user-deshboard',
  imports: [FormsModule, CommonModule, PlayQuizComponentComponent],
  templateUrl: './user-deshboard.component.html',
  styleUrl: './user-deshboard.component.css'
})
export class UserDeshboardComponent {
  quizList: any[] = [];
  questionlist: any[] = [];
  selectedQuestionIds: number[] = [];
  selectedQuiz: any = null; 
  createdBy: any = null;
  selectedCategory = ''; 
  selecteddifficulty = '';
  category: any[] = [];
  difficulty: any[] = [];
  userId: string | null = null;
  isLoading = true;
  dashboardData: any = {};


  constructor(
    private http: HttpClient,
    private quizService: QuizServiceService,
    private categoryService: CategoryService,
    private difficultyService: DifficultyService,
    private dashboardService: DashboardService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.userId = localStorage.getItem('user_id');
      if (this.userId) {
        this.getcategory();
        this.getdifficulty();
        this.fetchquiz();
        this.loadDashboardData();
      }
    }
    
  }
  loadDashboardData(): void {
    if (!this.userId) return;
    
    this.dashboardService.getUserDashboardStats(this.userId).subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.isLoading = false;
        console.log('Dashboard data:', data);
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
      }
    });
  }
  onCategoryChange() {
    if (this.selectedCategory && this.selecteddifficulty) {
      this.fetchQuizzesByCategoryAndDifficulty();
    }
  }

  onDifficultyChange() {
    if (this.selectedCategory && this.selecteddifficulty) {
      this.fetchQuizzesByCategoryAndDifficulty();
    }
  }

  fetchquiz() {
    this.quizService.fetchQuizzes().subscribe({
      next: (response) => {
        this.quizList = response;
      },
      error: (error) => {
        console.error(error);
      },
    });
   }

  fetchQuizzesByCategoryAndDifficulty() {
    console.log('Fetching quizzes with:');
    console.log('Category ID:', this.selectedCategory);
    console.log('Difficulty ID:', this.selecteddifficulty);
    
    this.quizService.fetchquizzesuser(this.selectedCategory, this.selecteddifficulty).subscribe({
      next: (response) => {
        console.log('Raw API Response:', response);
        if (Array.isArray(response)) {
          this.quizList = response;
          console.log('Quizzes found:', response.length);
        } else {
          console.warn('Unexpected response format:', response);
          this.quizList = [];
        }
      },
      error: (error) => {
        console.error('Error fetching quizzes:', error);
        this.quizList = [];
      },
    });
  }

  getcategory(){
    this.categoryService.getCategories().subscribe((response: any) => {
      this.category = response;
    });
  }

  getdifficulty(){
    this.difficultyService.getDifficulties().subscribe((response: any) => {
      this.difficulty = response;
    });
  }
  resetFilters() {
    this.selectedCategory = '';
    this.selecteddifficulty = '';
    this.fetchquiz(); // Fetch all quizzes
  }

  playQuiz(quiz: any) {
    this.selectedQuiz = quiz; 
    console.log(this.selectedQuiz);
  }

  closeQuiz(){
    this.selectedQuiz = null;
  }
}
