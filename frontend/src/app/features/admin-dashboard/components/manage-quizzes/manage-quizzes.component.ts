import { Component, OnInit } from '@angular/core';
import { QuizResponse, QuizServiceService } from '../../../../core/services/quiz-service.service';
import { QuestionService } from '../../../../core/services/question.service';
import { CommonModule } from '@angular/common';
import { CustomPopupComponent } from '../../../../shared/components/logout-button/custom-popup/custom-popup.component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Quiz } from '../../../../interfaces/quiz';

interface QuizDetails {
  _id: string;
  title: string;
  category: string;
  difficulty: string;
  description: string;
  status: string;
  createdAt: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
}

@Component({
  selector: 'app-manage-quizzes',
  imports: [CommonModule,CustomPopupComponent,FormsModule,RouterLink],
  templateUrl: './manage-quizzes.component.html',
  styleUrls: ['./manage-quizzes.component.css']
})
export class ManageQuizzesComponent implements OnInit {
  quizList: Quiz[] = [];      
  questionlist: any[] = [];      
  page = 1;                  
  limit = 10;                
  totalCount = 0;            
  totalPages = 0;            
  selectedQuiz: Quiz | null = null;
  isDialogOpen = false;
  dialogTitle = 'Default Title';
  dialogMessage = '';
  dialogType: 'delete' | 'status' | 'view' | 'edit' = 'delete';
  quizDetails: QuizDetails | null = null;
  editForm: any = null;

  constructor(private quizService: QuizServiceService, private questionService: QuestionService) {}

  ngOnInit(): void {
    this.fetchQuiz();
    this.fetchquestation();
  }
  activeDiv = 'form1'; 
  
  toggleDiv() {
    this.activeDiv = this.activeDiv === 'form1' ? 'form2' : 'form1';
  }
  openDialog(title: string, message: string, type: 'delete' | 'status' | 'view' | 'edit', quiz?: Quiz) {
    this.dialogTitle = title;
    this.dialogMessage = message;
    this.dialogType = type;
    this.selectedQuiz = quiz || null;
    this.isDialogOpen = true;

    if (type === 'view' && quiz?._id) {
      this.loadQuizDetails(quiz._id);
    } else if (type === 'edit' && quiz) {
      this.editForm = {
        title: quiz.title,
        category: quiz.category.name,
        difficulty: quiz.difficulty.name,
        description: quiz.description,
        status: quiz.status
      };
    }
  }

  loadQuizDetails(quizId: string) {
    this.quizService.fetchquizbyid(quizId).subscribe({
      next: (quiz) => {
        this.quizDetails = {
          _id: quiz._id,
          title: quiz.title,
          category: quiz.category.name,
          difficulty: quiz.difficulty.name,
          description: quiz.description || '',
          status: quiz.status,
          createdAt: quiz.createdAt,
          questions: quiz.questions.map((q: any) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer
          }))
        };
        console.log('Quiz details loaded:', this.quizDetails);
      },
      error: (err) => {
        console.error('Error loading quiz details:', err);
        this.quizDetails = null;
      }
    });
  }

  closeDialog(result: boolean) {
    if (result && this.selectedQuiz) {
      if (this.dialogType === 'delete') {
        this.deleteQuiz();
      } else if (this.dialogType === 'status') {
        this.updateQuizStatus();
      } else if (this.dialogType === 'edit') {
        this.updateQuiz();
      }
    }
    this.selectedQuiz = null;
    this.quizDetails = null;
    this.editForm = null;
    this.isDialogOpen = false;
  }

  fetchQuiz() {
    this.quizService.fetchQuizzesadmin(this.page, this.limit).subscribe({
      next: (response: QuizResponse) => {
        this.quizList = response.quizzes;
        this.totalCount = response.totalCount;
        this.totalPages = response.totalPages; 
        console.log(response);
      },
      error: (err) => {
        console.error('Error fetching quizzes:', err);
      }
    });
  }

  fetchquestation(){
    this.questionService.fetchQuestionAdmin('Entertainment: Film', 'medium').subscribe(questions => {
      console.log(questions);
    });    
  }
  
  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.fetchQuiz();
    }
  }
  
  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.fetchQuiz();
    }
  }
  
  goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.page = pageNumber;
      this.fetchQuiz();
    }
  }
  
  changeLimit(newLimit: string) {
    this.limit = parseInt(newLimit, 10); 
    this.page = 1;
    this.fetchQuiz();
  }

  updateQuizStatus() {
    if (!this.selectedQuiz || !this.selectedQuiz._id) {
      console.error('No quiz selected or missing ID');
      return;
    }

    const newStatus = this.selectedQuiz.status === 'active' ? 'draft' : 'active';
    console.log('Updating quiz status:', {
      quizId: this.selectedQuiz._id,
      currentStatus: this.selectedQuiz.status,
      newStatus: newStatus
    });

    this.quizService.updateQuizStatus(this.selectedQuiz._id, newStatus).subscribe({
      next: () => {
        console.log('Quiz status updated successfully');
        this.fetchQuiz(); // Refresh the list
      },
      error: (err) => {
        console.error('Error updating quiz status:', err);
      }
    });
  }

  deleteQuiz() {
    if (!this.selectedQuiz || !this.selectedQuiz._id) {
      console.error('No quiz selected or missing ID');
      return;
    }

    console.log('Deleting quiz:', this.selectedQuiz._id);

    this.quizService.deleteQuiz(this.selectedQuiz._id).subscribe({
      next: () => {
        console.log('Quiz deleted successfully');
        this.fetchQuiz(); // Refresh the list
      },
      error: (err) => {
        console.error('Error deleting quiz:', err);
      }
    });
  }

  updateQuiz() {
    if (!this.selectedQuiz || !this.editForm) {
      console.error('No quiz selected or edit form missing');
      return;
    }

    // Create an object to store only the changed fields
    const updates: any = {};

    // Only add fields that have changed
    if (this.editForm.title !== this.selectedQuiz.title) {
      updates.title = this.editForm.title;
    }
    if (this.editForm.category !== this.selectedQuiz.category.name) {
      updates.category = this.editForm.category;
    }
    if (this.editForm.difficulty !== this.selectedQuiz.difficulty.name) {
      updates.difficulty = this.editForm.difficulty;
    }
    if (this.editForm.description !== this.selectedQuiz.description) {
      updates.description = this.editForm.description;
    }
    if (this.editForm.status !== this.selectedQuiz.status) {
      updates.status = this.editForm.status;
    }

    // If no fields were changed, don't send the update
    if (Object.keys(updates).length === 0) {
      console.log('No changes detected');
      return;
    }

    console.log('Updating quiz:', {
      id: this.selectedQuiz._id,
      updates: updates
    });

    this.quizService.updateQuizAdmin(this.selectedQuiz._id, updates).subscribe({
      next: () => {
        console.log('Quiz updated successfully');
        this.fetchQuiz(); // Refresh the list
      },
      error: (err) => {
        console.error('Error updating quiz:', err);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
