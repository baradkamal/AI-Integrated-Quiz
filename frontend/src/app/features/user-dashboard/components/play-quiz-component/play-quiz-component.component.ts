import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { QuizServiceService } from '../../../../core/services/quiz-service.service';
import { AdvanceQuiz } from '../../../../interfaces/Advancequiz';
import { UserResponse } from '../../../../interfaces/user-response';

interface UserAnswer {
  question: string;
  userAnswer: string;
  isCorrect: boolean;
  points: number;
}

interface QuizResponse {
  user: string;
  quiz: string;
  responses: UserAnswer[];
  totalScore: number;
  status: 'completed';
  completedAt: string;
}

interface QuizOption {
  id: number;
  text: string;
}

@Component({
  selector: 'app-play-quiz-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './play-quiz-component.component.html',
  styleUrls: ['./play-quiz-component.component.css']
})
export class PlayQuizComponentComponent implements OnInit, OnDestroy {
  @Input() quizData!: AdvanceQuiz;
  @Output() closeQuiz = new EventEmitter<void>();
  
  currentQuestionIndex = signal(0);
  selectedAnswers = signal<{ [key: string]: string }>({});
  quizCompleted = signal(false);
  score = signal(0);
  showResult = false;
  timer: any;
  userId: string = '';
  
  questionOptions: QuizOption[][] = [];
  
  constructor(private http: HttpClient, private quizService: QuizServiceService) {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      this.userId = storedUserId;
    }
  }

  ngOnInit(): void {
    console.log(this.quizData)
    if (!this.quizData) {
      console.error('No quiz data provided');
      return;
    }

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

  get currentQuestion() {
    return this.quizData.questions[this.currentQuestionIndex()];
  }

  get allAnswers() {
    if (!this.currentQuestion) return [];
    return [
      this.currentQuestion.correct_answer,
      ...this.currentQuestion.incorrect_answers
    ].sort(() => Math.random() - 0.5);
  }

  selectAnswer(answer: string) {
    if (!this.currentQuestion) return;
    this.selectedAnswers.update(answers => ({
      ...answers,
      [this.currentQuestion._id]: answer
    }));
  }

  getCurrentOptions(): QuizOption[] {
    return this.questionOptions[this.currentQuestionIndex()];
  }

  isCorrectAnswer(optionText: string): boolean {
    return optionText === this.currentQuestion.correct_answer;
  }

  calculateTotalScore(): number {
    let totalScore = 0;
    Object.keys(this.selectedAnswers()).forEach(index => {
      const questionIndex = parseInt(index);
      if (this.selectedAnswers()[index] === this.quizData.questions[questionIndex].correct_answer) {
        totalScore++;
      }
    });
    return totalScore;
  }

  nextQuestion() {
    if (this.currentQuestionIndex() < this.quizData.questions.length - 1) {
      this.currentQuestionIndex.update(index => index + 1);
    } else {
      this.completeQuiz();
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.update(index => index - 1);
    }
  }

  completeQuiz() {
    const responses: UserAnswer[] = this.quizData.questions.map(question => {
      const userAnswer = this.selectedAnswers()[question._id] || '';
      const isCorrect = userAnswer === question.correct_answer;
      const correctAnswer = question.correct_answer;
      const points = isCorrect ? 1 : 0;

      return {
        question: question._id,
        userAnswer,
        isCorrect,
        correctAnswer,
        points
      };
    });

    const totalScore = responses.reduce((sum, response) => sum + response.points, 0);

    const quizResponse: QuizResponse = {
      user: this.userId,
      quiz: this.quizData._id,
      responses,
      totalScore,
      status: 'completed',
      completedAt: new Date().toISOString()
    };


    this.quizService.submitQuizResponse(quizResponse).subscribe({
      next: (response) => {
        
        this.score.set(totalScore);
        this.quizCompleted.set(true);
        this.showResult = true;
      },
      error: (error) => {
        console.error('Error submitting quiz response:', error);
        if (error.error) {
          console.error('Error details:', error.error);
        }
      }
    });
  }

  get progress() {
    return ((this.currentQuestionIndex() + 1) / this.quizData.questions.length) * 100;
  }

  isAnswerSelected(answer: string): boolean {
    if (!this.currentQuestion) return false;
    return this.selectedAnswers()[this.currentQuestion._id] === answer;
  }

  isLastQuestion(): boolean {
    return this.currentQuestionIndex() === this.quizData.questions.length - 1;
  }

  restartQuiz() {
    this.currentQuestionIndex.set(0);
    this.selectedAnswers.set({});
    this.quizCompleted.set(false);
    this.score.set(0);
    this.showResult = false;
    
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
