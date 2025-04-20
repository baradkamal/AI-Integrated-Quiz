import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OpenTriviaService } from '../../../../core/services/open-trivia.service';
import { QuestionService } from '../../../../core/services/question.service';
import { GenAiApiService } from '../../../../core/services/gen-ai-api.service';
import { CustomPopupComponent } from '../../../../shared/components/logout-button/custom-popup/custom-popup.component';

@Component({
  selector: 'app-create-new-questions',
  imports: [CommonModule, FormsModule, CustomPopupComponent],
  templateUrl: './create-new-questions.component.html',
  styleUrl: './create-new-questions.component.css'
})
export class CreateNewQuestionsComponent implements OnInit {
  categories: any[] = []; 
  selectedCategory = '';   
  selectedType = 'multiple';
  numberofquestation =  "";
  selecteddifficulty = '';
  QuestionList: any[] = [];
  selectedQuestions: any[] = [];
  databaseQuestionList: any[] = [];
  Questionobj: any = {
    "type": "multiple",
    "difficulty": "",
    "category": "",
    "question": "",
    "correct_answer": "",
    "incorrect_answers": ["", "", ""] 
  };
  showPopup = false;

  constructor(
    private openTriviaService: OpenTriviaService,
    private questionService: QuestionService,
    private genAiApiService: GenAiApiService
  ) {}

  ngOnInit() {
    this.getCategories();
  }
  activeDiv = 'form1'; 
  
  toggleDiv() {
    this.activeDiv = this.activeDiv === 'form1' ? 'form2' : 'form1';
  }
  openPopup() {
    this.showPopup = true;
  }

  // Method to check if an answer is duplicated
  isDuplicateAnswer(index: number): boolean {
    if (index === -1) {
      // Checking correct answer against incorrect answers
      const correctAnswer = this.Questionobj.correct_answer?.toLowerCase().trim();
      if (!correctAnswer) return false;
      
      return this.Questionobj.incorrect_answers.some(
        (answer: string) => answer?.toLowerCase().trim() === correctAnswer
      );
    } else {
      // Checking incorrect answer against correct answer and other incorrect answers
      const currentAnswer = this.Questionobj.incorrect_answers[index]?.toLowerCase().trim();
      if (!currentAnswer) return false;
      
      // Check against correct answer
      if (this.Questionobj.correct_answer?.toLowerCase().trim() === currentAnswer) {
        return true;
      }
      
      // Check against other incorrect answers
      return this.Questionobj.incorrect_answers.some(
        (answer: string, i: number) => 
          i !== index && 
          answer?.toLowerCase().trim() === currentAnswer
      );
    }
  }

  // Method to validate the entire form
  isFormValid(): boolean {
    // Check required fields
    if (!this.Questionobj.difficulty ||
        !this.Questionobj.category ||
        !this.Questionobj.question ||
        !this.Questionobj.correct_answer ||
        !this.Questionobj.incorrect_answers[0] ||
        !this.Questionobj.incorrect_answers[1] ||
        !this.Questionobj.incorrect_answers[2]) {
      return false;
    }

    // Check for duplicate answers
    if (this.isDuplicateAnswer(-1) ||
        this.isDuplicateAnswer(0) ||
        this.isDuplicateAnswer(1) ||
        this.isDuplicateAnswer(2)) {
      return false;
    }

    return true;
  }

  postMannualQuestation() {
    if (!this.isFormValid()) {
      return;
    }

    this.questionService.createQuestion(this.Questionobj).subscribe({
      next: (response: any) => {
        console.log(response);
        alert("Question posted successfully");
        this.showPopup = false;
        this.resetForm();
      },
      error: (error) => {
        console.error("Error posting question:", error);
        alert('Failed to post question. Please try again.');
      }
    });
  }

  resetForm() {
    this.Questionobj = {
      "type": "multiple",
      "difficulty": "",
      "category": "",
      "question": "",
      "correct_answer": "",
      "incorrect_answers": ["", "", ""] 
    };
  }
  
  getCategories() {
    this.openTriviaService.getCategories().subscribe({
      next: (data: any) => {
        this.categories = data.trivia_categories;
      },
      error: (error) => {
        console.error("Error fetching categories:", error);
      }
    });
  }

  GetQuestionwithcategory() {
    if (!this.selectedCategory) {
      alert("Please select a category.");
      return;
    }

    this.openTriviaService.getQuestionsWithCategory(parseInt(this.selectedCategory), this.selectedType).subscribe({
      next: (response: any) => {
        this.QuestionList = response.results;
      },
      error: (error) => {
        console.error("Error fetching questions:", error);
        alert("Failed to fetch questions. Please try again.");
      }
    });
  }

  GetQuestion() {
    this.openTriviaService.getQuestions().subscribe({
      next: (response: any) => {
        this.QuestionList = response.results;
      },
      error: (error) => {
        console.error("Error fetching questions:", error);
        alert('Failed to fetch questions. Please try again.');
      }
    });
  }

  GetGenaiquestation() {
    // Check if any of the required inputs are not provided
    if (!this.selectedCategory || !this.numberofquestation || !this.selectedType || !this.selecteddifficulty) {
        alert("Please select all 4 inputs.");
        return;
    }

    // Proceed to create questions if all inputs are valid
    this.genAiApiService.createQuestion(
        this.selectedCategory, 
        this.selectedType, 
        this.selecteddifficulty, 
        this.numberofquestation
    ).subscribe({
        next: (response: any) => {
            if (response && Array.isArray(response)) {
                this.QuestionList = response.map((question: any) => ({
                    ...question,
                    category: this.selectedCategory,
                    type: this.selectedType,
                    difficulty: this.selecteddifficulty
                }));
                console.log('Generated questions:', this.QuestionList);
            } else {
                console.error('Invalid response format:', response);
                alert('Received invalid response format from the server.');
            }
        },
        error: (error) => {
            console.error("Error generating questions:", error);
            alert("Failed to generate questions. Please try again.");
        }
    });
}


  getDatabaseQuestion() {
    this.questionService.getDatabaseQuestions().subscribe({
      next: (response: any) => {
        this.databaseQuestionList = response;
      },
      error: (error) => {
        console.error("Error fetching questions:", error);
        alert('Failed to fetch questions. Please try again.');
      }
    });
  }

  postQuestion(question: any) {
    const questionObj = {
      category: question.category,
      type: question.type, 
      difficulty: question.difficulty,
      question: question.question,
      correct_answer: question.correct_answer,
      incorrect_answers: question.incorrect_answers
    };

    this.questionService.createQuestion(questionObj).subscribe({
      next: (response: any) => {
        console.log(response);
        this.getDatabaseQuestion();
      },
      error: (error) => {
        console.error("Error posting question:", error);
        alert('Failed to post question. Please try again.');
      }
    });
  }

  deleteQuestion(item: any) {
    this.questionService.deleteQuestion(item._id).subscribe({
      next: (response: any) => {
        this.getDatabaseQuestion();
      }
    });
  }
}

