import { Component } from '@angular/core';
import { NevbarComponent } from "../../../../layouts/user/nevbar/nevbar.component";
import { FormsModule } from '@angular/forms';
import { QuizServiceService } from '../../../../core/services/quiz-service.service';
import { QuestionService } from '../../../../core/services/question.service';
import { HttpClient } from '@angular/common/http';
import { PlayQuizComponentComponent } from "../../components/play-quiz-component/play-quiz-component.component";


@Component({
  selector: 'app-user-deshboard',
  imports: [NevbarComponent, FormsModule, PlayQuizComponentComponent],
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
    this.getquestation();
    this.fetchquiz();
  }
  constructor(
    private http: HttpClient,
    private quizService: QuizServiceService,
    private questionService: QuestionService
  ) {}

   fetchquiz() {
    this.quizService.fetchQuizzes().subscribe({
      next: (response) => {
        this.quizList = response;
        
        this.quizList.forEach(quiz => {
          if (quiz.questions && quiz.questions.length > 0) {
            this.getQuestionsById(quiz.questions).then((questions) => {
              quiz.questions = questions; 
              
            });
          }
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
   }
  getQuestionsById(questionIds: string[]): Promise<any[]> {
    return this.questionService.findQuestionbyid(questionIds)
    .toPromise()
    .then((response: any) => response )
    .catch((error) => {
      console.error('error fetching questions: ', error);
      return [];
    });
  }
  getquestation(){
    this.questionService.fetchquestion().subscribe({
      next: (response) => {
        this.questionlist = response;
        
      }, error: (error) =>{
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
