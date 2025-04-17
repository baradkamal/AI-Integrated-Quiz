import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../../../../core/services/question.service';
import { CategoryService } from '../../../../core/services/category.service';
import { FormsModule } from '@angular/forms';
import { CustomPopupComponent } from '../../../../shared/components/logout-button/custom-popup/custom-popup.component';
import { RouterLink } from '@angular/router';

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
  selector: 'app-manage-questation',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomPopupComponent,RouterLink],
  templateUrl: './manage-questation.component.html',
  styleUrls: ['./manage-questation.component.css']
})
export class ManageQuestationComponent implements OnInit {
  questions: Question[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  isLoading: boolean = false;
  error: string | null = null;

  // Filter options
  selectedCategory: string = '';
  selectedDifficulty: string = '';
  selectedType: string = '';
  searchQuery: string = '';

  // Categories from API
  categories: string[] = [];

  // Popup states
  showViewPopup: boolean = false;
  showEditPopup: boolean = false;
  showDeletePopup: boolean = false;
  selectedQuestion: Question | null = null;
  editQuestionForm: any = {};

  constructor(
    private questionService: QuestionService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadQuestions();
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories.map((category: any) => category.name);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.error = 'Failed to load categories';
      }
    });
  }

  loadQuestions() {
    this.isLoading = true;
    this.error = null;

    const params = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      category: this.selectedCategory,
      difficulty: this.selectedDifficulty,
      type: this.selectedType,
      search: this.searchQuery
    };

    console.log('Loading questions with params:', params);

    this.questionService.fetchQuestions(params).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        if (response && response.questions) {
          this.questions = response.questions;
          this.totalItems = response.totalCount || 0;
          this.totalPages = response.totalPages || Math.ceil(this.totalItems / this.itemsPerPage);
        } else {
          console.warn('Unexpected response format:', response);
          this.questions = [];
          this.totalItems = 0;
          this.totalPages = 0;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading questions:', error);
        this.error = 'Failed to load questions. Please try again.';
        this.isLoading = false;
      }
    });
  }

  // View Question
  viewQuestion(question: Question): void {
    this.selectedQuestion = question;
    this.showViewPopup = true;
  }

  closeViewPopup(): void {
    this.showViewPopup = false;
    this.selectedQuestion = null;
  }

  // Edit Question
  editQuestion(question: Question): void {
    this.selectedQuestion = question;
    this.editQuestionForm = {
      type: question.type,
      difficulty: question.difficulty,
      category: question.category,
      question: question.question,
      correct_answer: question.correct_answer,
      incorrect_answers: [...question.incorrect_answers]
    };
    this.showEditPopup = true;
  }

  closeEditPopup(): void {
    this.showEditPopup = false;
    this.selectedQuestion = null;
    this.editQuestionForm = {};
  }

  onEditSave(): void {
    if (this.selectedQuestion) {
      this.questionService.updateQuestion(this.selectedQuestion._id, this.editQuestionForm)
        .subscribe({
          next: () => {
            this.loadQuestions();
            this.showEditPopup = false;
          },
          error: (error) => {
            this.error = 'Failed to update question';
          }
        });
    }
  }

  // Delete Question
  deleteQuestion(question: Question): void {
    this.selectedQuestion = question;
    this.showDeletePopup = true;
  }

  closeDeletePopup(): void {
    this.showDeletePopup = false;
    this.selectedQuestion = null;
  }

  onDeleteConfirm(): void {
    if (this.selectedQuestion) {
      this.questionService.deleteQuestion(this.selectedQuestion._id)
        .subscribe({
          next: () => {
            this.loadQuestions();
            this.showDeletePopup = false;
          },
          error: (error) => {
            this.error = 'Failed to delete question';
          }
        });
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadQuestions();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadQuestions();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadQuestions();
  }

  getDifficultyClass(difficulty: string): string {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
