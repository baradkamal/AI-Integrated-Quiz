import { Component } from '@angular/core';
import { NevbarComponent } from "../../../../layouts/user/nevbar/nevbar.component";
import { FormsModule } from '@angular/forms';
import { QuizServiceService } from '../../../../core/services/quiz-service.service';
import { HttpClient } from '@angular/common/http';
import { PlayQuizComponentComponent } from "../../components/play-quiz-component/play-quiz-component.component";


@Component({
  selector: 'app-user-deshboard',
  imports: [FormsModule, PlayQuizComponentComponent],
  templateUrl: './user-deshboard.component.html',
  styleUrl: './user-deshboard.component.css'
})
export class UserDeshboardComponent {
  quizList: any[] = [];
  questionlist: any[] = [];
  selectedQuestionIds: number[] = [];
  selectedQuiz: any = null; 
  createdBy: any = null;
  



  
  ngOnInit(): void {
    this.fetchquiz();
  }
  constructor(
    private http: HttpClient,
    private quizService: QuizServiceService
  ) {}

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
  
  

  playQuiz(quiz: any) {
    this.selectedQuiz = quiz; 
  }
  closeQuiz(){
    this.selectedQuiz = null;
  }
}
