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
  reviewAnswer(answer: string, question: string): Observable<any> {
    return this.http.post(`${this.apiUrl}genaireviewanswer`, { answer, question });
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
  createQuizFromText(text: string, numberOfQuestions: number): Observable<any> {
    return this.http.post(`${this.apiUrl}genaiquizfromtext`, { 
      text, 
      numberOfQuestions 
    });
  }

  // Get content
  getContent(): Observable<any> {
    return this.http.get(`${this.apiUrl}content`);
  }
}
