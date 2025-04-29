import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenAiApiService {
  private apiUrl = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) {}

  // Review answer using GenAI
  reviewAnswer(correctAnswer: string, question: string, userAnswer: string): Observable<any> {
    return this.http.post(`${this.apiUrl}genaireviewanswer`, { correctAnswer, question, userAnswer });
  }

  // Create question using GenAI
  createQuestion(Category: string, Type: string, Difficulty: string, Nofqustation: string): Observable<any> {
    return this.http.post(`${this.apiUrl}genaiquestation`, { 
      Category, 
      Type, 
      Difficulty, 
      Nofqustation 
    });
  }

  // Create quiz using GenAI
  createQuiz(topic: string, numberOfQuestions: number, difficulty: string): Observable<any> {
    return this.http.post(`${this.apiUrl}genaiquiz`, { 
      topic, 
      numberOfQuestions, 
      difficulty 
    });
  }

  // Create quiz from text using GenAI
  createQuizFromText(Difficulty: string, Category: string, Type: string, text: string, Nofqustation: number): Observable<any> {
    return this.http.post(`${this.apiUrl}genaiquizfromtext`, { 
      Difficulty, 
      Category, 
      Type, 
      text, 
      Nofqustation  
    });
  }

  // Get content
  getContent(): Observable<any> {
    return this.http.get(`${this.apiUrl}content`);
  }
}
