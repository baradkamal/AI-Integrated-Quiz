import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface QuizOption {
  id: number;
  text: string;
}

@Component({
  selector: 'app-play-quiz-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './play-quiz-component.component.html',
  styleUrls: ['./play-quiz-component.component.css']
})
export class PlayQuizComponentComponent implements OnInit, OnDestroy {
  @Input() quizData: any;
  @Output() closeQuiz = new EventEmitter<void>();
  
  currentQuestionIndex = 0;
  selectedAnswers: { [key: number]: string } = {};
  score = 0;
  showResult = false;
  timer: any;
  
  questionOptions: QuizOption[][] = [];
  
  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (this.quizData?.questions) {
      this.questionOptions = this.quizData.questions.map((question: any) => 
        this.shuffleOptions(question)
      );
    }
  }

  shuffleOptions(question: any): QuizOption[] {
    const options = [...question.incorrect_answers, question.correct_answer];
    return options
      .sort(() => Math.random() - 0.5)
      .map((option: string, index: number) => ({
        id: index,
        text: option
      }));
  }

  selectAnswer(answer: string) {
    this.selectedAnswers[this.currentQuestionIndex] = answer;
  }

  getCurrentOptions(): QuizOption[] {
    return this.questionOptions[this.currentQuestionIndex] || [];
  }

  isCorrectAnswer(optionText: string): boolean {
    return optionText === this.quizData.questions[this.currentQuestionIndex].correct_answer;
  }

  calculateTotalScore(): number {
    let totalScore = 0;
    Object.keys(this.selectedAnswers).forEach(index => {
      const questionIndex = parseInt(index);
      if (this.selectedAnswers[questionIndex] === this.quizData.questions[questionIndex].correct_answer) {
        totalScore++;
      }
    });
    return totalScore;
  }

  nextQuestion() {
    if (!this.selectedAnswers[this.currentQuestionIndex]) {
      return;
    }

    if (this.currentQuestionIndex < this.quizData.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.score = this.calculateTotalScore();
      this.showResult = true;
      this.submitResponses();
    }
  }

  submitResponses() {
    const userId = localStorage.getItem('user_id');
    const quizId = this.quizData._id;

    if (!quizId) return;

    this.score = this.calculateTotalScore();

    const userResponse = {
      user: userId,
      quiz: quizId,
      responses: this.quizData.questions.map((question: any, index: number) => {
        const userAnswer = this.selectedAnswers[index] || '';
        const isCorrect = userAnswer === question.correct_answer;
        
        return {
          question: question._id,
          userAnswer: userAnswer,
          isCorrect: isCorrect,
          points: isCorrect ? 1 : 0
        };
      }),
      totalScore: this.score
    };

    this.http.post('http://localhost:3000/api/userResponse', userResponse, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).subscribe({
      next: () => {},
      error: (error) => {
        if (error.status === 500 && error.error) {
          // Handle server error silently
        }
      }
    });
  }

  restartQuiz() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.showResult = false;
    this.selectedAnswers = {};
    
    if (this.quizData?.questions) {
      this.questionOptions = this.quizData.questions.map((question: any) => 
        this.shuffleOptions(question)
      );
    }
  }

  close() {
    clearInterval(this.timer);
    this.closeQuiz.emit();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
