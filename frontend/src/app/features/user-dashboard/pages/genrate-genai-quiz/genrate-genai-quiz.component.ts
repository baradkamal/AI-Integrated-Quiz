import { Component, OnInit } from '@angular/core';
import { GenAiApiService } from '../../../../core/services/gen-ai-api.service';
import { ImageOcrService } from '../../../../core/services/image-ocr.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  // OCR and file handling properties
  selectedFile: File | null = null;
  ocrText: string = '';
  ocrProcessing: boolean = false;
  ocrError: string = '';
  contentSource: 'manual' | 'file' = 'manual';

  quizResult: QuizResult | null = null;
  errorMessage = '';
  loading = false;
  
  currentQuestionIndex = 0;
  selectedAnswer: string | null = null;
  score = 0;
  quizStarted = false;
  quizCompleted = false;

  constructor(private genaiService: GenAiApiService, private ocrService: ImageOcrService) {}

  ngOnInit() {
    // Initialize the quiz object
    this.quizobj = {
      Difficulty: '',
      Category: '',
      Type: '',
      Nofqustation: 1, // Default to 1 question
      text: ''
    };
    
    // Ensure content source is set to manual by default
    this.contentSource = 'manual';
  }
  
  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  // Set content source (manual input or file upload)
  setContentSource(source: 'manual' | 'file') {
    this.contentSource = source;
    
    // Reset file-related state when switching to manual input
    if (source === 'manual') {
      this.removeFile();
    }
  }

  // Handle file selection
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    
    const file = input.files[0];
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    
    // Validate file size
    if (file.size > maxSizeInBytes) {
      this.ocrError = 'File size exceeds 5MB limit';
      return;
    }
    
    this.selectedFile = file;
    this.ocrError = '';
    this.ocrText = '';
    
    // Automatically process the file after selection
    this.processFile();
  }

  // Process the file with OCR service
  processFile() {
    if (!this.selectedFile) return;

    this.ocrProcessing = true;
    this.ocrError = '';
    
    this.ocrService.uploadFileForOCR(this.selectedFile).subscribe({
      next: (res) => {
        this.ocrText = res.text;
        this.ocrProcessing = false;
        
        // Automatically set the extracted text to quizobj.text
        this.quizobj.text = this.ocrText;
      },
      error: (err) => {
        this.ocrError = 'Failed to process file: ' + (err.message || 'Unknown error');
        this.ocrProcessing = false;
        console.error('OCR processing error:', err);
      }
    });
  }

  // Remove the selected file
  removeFile() {
    this.selectedFile = null;
    this.ocrText = '';
    this.ocrError = '';
    this.quizobj.text = ''; // Clear the text in quizobj when file is removed
  }

  // Format file size for display
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  generatequiz() {
    // Validate inputs
    if (!this.quizobj.Difficulty) {
      this.errorMessage = 'Please select a difficulty level.';
      return;
    }
    
    if (!this.quizobj.Category) {
      this.errorMessage = 'Please select a category.';
      return;
    }
    
    if (!this.quizobj.Type) {
      this.errorMessage = 'Please select a quiz type.';
      return;
    }
    
    if (!this.quizobj.text.trim()) {
      this.errorMessage = 'Please enter text or upload a file to generate a quiz.';
      return;
    }
    
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
        console.log("Quiz generated successfully:", response);
      },
      error: (err) => {
        console.error("Error generating quiz:", err);
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
  }

  selectAnswer(option: string) {
    this.selectedAnswer = option;
  }

  // Improved submitAnswer method to handle both letter answers and full-text answers
submitAnswer() {
  if (!this.selectedAnswer || !this.quizResult) return;

  const currentQuestion = this.quizResult.questions[this.currentQuestionIndex];
  const selectedIndex = this.selectedAnswer.charCodeAt(0) - 65; 
  const selectedOptionText = currentQuestion.options[selectedIndex];
  
  // First try to match by letter (e.g., "A", "B", "C")
  let isCorrect = this.selectedAnswer.trim().toUpperCase() === currentQuestion.answer.trim().toUpperCase();
  
  // If not matching by letter, try to match by full text content (e.g., "Power and responsibility")
  if (!isCorrect) {
    isCorrect = selectedOptionText.trim().toUpperCase() === currentQuestion.answer.trim().toUpperCase();
  }
  
  if (isCorrect) {
    this.score++;
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
  }
  
  backToQuizGeneration() {
    this.resetQuizState();
  }

  retryQuiz() {
    if (this.quizResult) {
      this.playQuiz();
    }
  }
}