import { Component, OnInit } from '@angular/core';
import { QuizResponse, QuizServiceService } from '../../../../core/services/quiz-service.service';
import { CommonModule } from '@angular/common';
import { CustomPopupComponent } from '../../../../shared/components/logout-button/custom-popup/custom-popup.component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-manage-quizzes',
  imports: [CommonModule,CustomPopupComponent,FormsModule,RouterLink],
  templateUrl: './manage-quizzes.component.html',
  styleUrls: ['./manage-quizzes.component.css']
})
export class ManageQuizzesComponent implements OnInit {

  quizList: any[] = [];      
  questionlist: any[] = [];      
  page = 1;                  
  limit = 10;                
  totalCount = 0;            
  totalPages = 0;            

  constructor(private quizService: QuizServiceService) {}

  ngOnInit(): void {
    this.fetchQuiz();
  }
  isDialogOpen = false;
  dialogTitle = 'Default Title';

  openDialog(title: string) {
    this.dialogTitle = title;
    this.isDialogOpen = true;
  }

  closeDialog(result: boolean) {
    this.isDialogOpen = false;
    console.log('Dialog result:', result);
  }
  // Fetch quizzes from the service with pagination
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
  createQuiz(){}
  editQuiz(){}
  deleteQuiz(){}
}
