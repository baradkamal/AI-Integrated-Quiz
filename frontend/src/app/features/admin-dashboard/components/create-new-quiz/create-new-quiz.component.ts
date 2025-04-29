import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { QuizServiceService } from '../../../../core/services/quiz-service.service';
import { CategoryService } from '../../../../core/services/category.service';
import { DifficultyService } from '../../../../core/services/difficulty.service';
import { QuestionService } from '../../../../core/services/question.service';
import { Router } from '@angular/router';
import { Quiz } from '../../../../interfaces/quiz';

interface Question {
  _id: string;
  type: string;
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

@Component({
  selector: 'app-create-new-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-new-quiz.component.html',
  styleUrls: ['./create-new-quiz.component.css']
})
export class CreateNewQuizComponent implements OnInit {
  quizForm: FormGroup;
  categories: any[] = [];
  difficulties: any[] = [];
  loading: boolean = false;
  error: string | null = null;
  success: string | null = null;
  availableQuestions: Question[] = [];
  selectedQuestions: Question[] = [];
  showQuestionSelector: boolean = false;
  userId: string = '';

  constructor(
    private fb: FormBuilder,
    private quizService: QuizServiceService,
    private categoryService: CategoryService,
    private difficultyService: DifficultyService,
    private questionService: QuestionService,
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router
  ) {
    this.quizForm = this.fb.group({
      title: ['', Validators.required],
      categoryId: ['', Validators.required],
      difficultyId: ['', Validators.required],
      timeLimit: [30],
      description: ['', Validators.required],
      passingScore: [70],
      status: ['draft'],
      questions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.userId = localStorage.getItem('user_id') || '';
    }
    this.loadCategories();
    this.loadDifficulties();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.error = 'Failed to load categories';
      }
    });
  }

  loadDifficulties() {
    this.difficultyService.getDifficulties().subscribe({
      next: (difficulties) => {
        this.difficulties = difficulties;
      },
      error: (error) => {
        console.error('Error loading difficulties:', error);
        this.error = 'Failed to load difficulties';
      }
    });
  }

  onCategoryAndDifficultyChange() {
    const categoryId = this.quizForm.get('categoryId')?.value;
    const difficultyId = this.quizForm.get('difficultyId')?.value;

    if (categoryId && difficultyId) {
      this.loading = true;
      this.error = null;

      const category = this.categories.find(c => c._id === categoryId);
      const difficulty = this.difficulties.find(d => d._id === difficultyId);

      if (category && difficulty) {
        this.questionService.fetchQuestionAdmin(category.name, difficulty.name).subscribe({
          next: (response: any) => {
            console.log('Fetched questions:', response); // Debug log
            
            // Check if response is an object with a questions property
            if (response && response.questions && Array.isArray(response.questions)) {
              this.availableQuestions = response.questions;
            } else if (Array.isArray(response)) {
              this.availableQuestions = response;
            } else {
              this.availableQuestions = [];
              this.error = 'Invalid response format from server';
            }
            
            this.showQuestionSelector = true;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading questions:', error);
            this.error = 'Failed to load questions';
            this.loading = false;
          }
        });
      }
    }
  }

  toggleQuestionSelection(question: Question) {
    const index = this.selectedQuestions.findIndex(q => q._id === question._id);
    if (index === -1) {
      this.selectedQuestions.push(question);
    } else {
      this.selectedQuestions.splice(index, 1);
    }
  }

  isQuestionSelected(question: Question): boolean {
    return this.selectedQuestions.some(q => q._id === question._id);
  }

  addSelectedQuestions() {
    this.selectedQuestions.forEach(question => {
      // Here we don't need to create a question form since we are only passing IDs now
      this.questions.push(this.fb.control(question._id)); // Push only the question ID
    });

    this.selectedQuestions = [];
    this.showQuestionSelector = false;
  }

  get questions() {
    return this.quizForm.get('questions') as FormArray;
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  // Get question text by ID for display in the selected questions list
  getQuestionText(questionId: string): string {
    const question = this.availableQuestions.find(q => q._id === questionId);
    return question ? question.question : `Question ID: ${questionId}`;
  }

  onSubmit() {
    if (this.quizForm.valid) {
      const categoryId = this.quizForm.get('categoryId')?.value;
      const difficultyId = this.quizForm.get('difficultyId')?.value;

      // Find the selected category and difficulty
      const selectedCategory = this.categories.find(c => c._id === categoryId);
      const selectedDifficulty = this.difficulties.find(d => d._id === difficultyId);

      if (!selectedCategory || !selectedDifficulty) {
        console.error('Selected category or difficulty not found');
        return;
      }

      const quizData: Quiz = {
        _id: '', // This will be generated by the backend
        title: this.quizForm.get('title')?.value,
        category: selectedCategory._id, // Send the category ID directly
        difficulty: selectedDifficulty._id, // Send the difficulty ID directly
        description: this.quizForm.get('description')?.value || '',
        timeLimit: this.quizForm.get('timeLimit')?.value || 0,
        passingScore: this.quizForm.get('passingScore')?.value || 0,
        status: 'draft',
        settings: {
          showAnswers: this.quizForm.get('showAnswers')?.value || false,
          publicLeaderboard: this.quizForm.get('publicLeaderboard')?.value || false
        },
        createdBy: this.userId,
        questions: this.quizForm.get('questions')?.value || [],
        createdAt: new Date().toISOString()
      };

      console.log('Saving quiz with data:', quizData);

      this.quizService.saveQuiz(quizData).subscribe({
        next: (response) => {
          console.log('Quiz saved successfully:', response);
          this.router.navigate(['/manage-quizzes']);
        },
        error: (error) => {
          console.error('Error saving quiz:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.quizForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.quizForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }
}
