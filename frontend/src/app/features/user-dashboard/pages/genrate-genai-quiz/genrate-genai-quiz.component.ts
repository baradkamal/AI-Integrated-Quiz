import { Component, OnInit } from '@angular/core';
import { GenAiApiService } from '../../../../core/services/gen-ai-api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

interface QuizResult {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  questions: QuizQuestion[];
}

@Component({
  selector: 'app-genrate-genai-quiz',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './genrate-genai-quiz.component.html',
  styleUrl: './genrate-genai-quiz.component.css'
})
export class GenrateGenaiQuizComponent implements OnInit {
  
  quizobj!: {
    Difficulty: string;
    Category: string;
    Type: string;
    Nofqustation: number;
    text: string;
  };

  // File upload properties
  uploadedFile: File | null = null;
  fileUploadError: string = '';
  fileContent: string = '';

  quizResult: QuizResult | null = null;
  errorMessage = '';
  loading = false;

  
  currentQuestionIndex = 0;
  selectedAnswer: string | null = null;
  score = 0;
  quizStarted = false;
  quizCompleted = false;

  constructor(private genaiService: GenAiApiService) {}

  ngOnInit() {
    
    this.quizobj = {
      Difficulty: '',
      Category: '',
      Type: '',
      Nofqustation: 1,
      text: ''
    };
  }

  
  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  generatequiz() {
    this.loading = true;
    this.errorMessage = '';
    this.quizResult = null;
    this.resetQuizState();

    this.genaiService.createQuizFromText(
      this.quizobj.Difficulty,
      this.quizobj.Category,
      this.quizobj.Type,
      this.quizobj.text,
      this.quizobj.Nofqustation
    ).subscribe({
      next: (response: QuizResult) => {
        this.quizResult = response;
        this.loading = false;
        this.logQuizDetails();
        console.log("quiz ai genrated" + response);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Something went wrong while generating the quiz.';
        this.loading = false;
      }
    });
  }

  playQuiz() {
    this.resetQuizState();
    this.quizStarted = true;
    this.quizCompleted = false;
  }

  resetQuizState() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.selectedAnswer = null;
    this.quizStarted = false;
    this.quizCompleted = false;
    console.log('Quiz state reset');
  }

  selectAnswer(option: string) {
    this.selectedAnswer = option;
    console.log('Selected answer set to:', option);
  }

  submitAnswer() {
    
    if (!this.selectedAnswer || !this.quizResult) return;

    const currentQuestion = this.quizResult.questions[this.currentQuestionIndex];
    
    
    const selectedIndex = this.selectedAnswer.charCodeAt(0) - 65; 
    
    
    const selectedOptionText = currentQuestion.options[selectedIndex];
    
    console.log('Current Question:', currentQuestion);
    console.log('Selected Answer Letter:', this.selectedAnswer);
    console.log('Selected Option Text:', selectedOptionText);
    console.log('Correct Answer:', currentQuestion.answer);

    
    if (selectedOptionText.trim().toUpperCase() === currentQuestion.answer.trim().toUpperCase()) {
      this.score++;
      console.log('Correct Answer! Score:', this.score);
    } else {
      console.log('Incorrect Answer');
    }

    
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex >= this.quizResult.questions.length) {
      this.completeQuiz();
    } else {
      
      this.selectedAnswer = null;
    }
  }

  completeQuiz() {
    this.quizStarted = false;
    this.quizCompleted = true;
    console.log('Quiz completed with final score:', this.score);
  }

  
  backToQuizGeneration() {
    
    this.resetQuizState();
    console.log('Back to quiz display');
  }

  retryQuiz() {
    if (this.quizResult) {
      this.playQuiz();
    }
  }

  // Debugging method
  logQuizDetails() {
    if (this.quizResult) {
      console.log('Quiz Details:', {
        title: this.quizResult.title,
        questions: this.quizResult.questions.map(q => ({
          question: q.question,
          answer: q.answer
        }))
      });
    }
  }
}
