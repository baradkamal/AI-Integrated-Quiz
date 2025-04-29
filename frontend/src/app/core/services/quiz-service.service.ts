import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Quiz } from '../../interfaces/quiz';
import { AdvanceQuiz } from '../../interfaces/Advancequiz';
import { UserResponse } from '../../interfaces/user-response';

export interface QuizResponse {
  quizzes: Quiz[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class QuizServiceService {
  private apiUrl = 'http://localhost:3000/api';
  private getquizurl = 'http://localhost:3000/api/adminadvancequiz';
  private getquizurladmin = 'http://localhost:3000/api/Advancequiz';
  private getquizbyid = 'http://localhost:3000/api/quizbyid';
  private getquizbyids = 'http://localhost:3000/api/quizbyids';
  
  constructor(private http: HttpClient) { }

  fetchQuizzes(): Observable<any[]> {
    return this.http.get<any[]>(this.getquizurladmin);
  }

  fetchquizzesuser(category:any,difficulty:any,): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/Advancequizuser?category=${category}&difficulty=${difficulty}`)
  }

  fetchQuizzesadmin(page: number = 1, limit: number = 10): Observable<QuizResponse> {
    return this.http.get<QuizResponse>(`${this.getquizurl}?page=${page}&limit=${limit}`);
  }

  fetchquizbyid(id: any): Observable<AdvanceQuiz> {
    return this.http.get<AdvanceQuiz>(this.getquizurladmin+ '/'+id);
  }

  fetchquizbyids(quizIds: any): Observable<any[]> {
    return this.http.post<any[]>(this.getquizbyids, { quizIds });
  }

  saveQuiz(quiz:Quiz): Observable<Quiz> {
     return this.http.post<Quiz>(this.getquizurladmin,quiz);
  }

  deleteQuiz(quizId: string): Observable<Quiz> {
    return this.http.delete<Quiz>(`${this.getquizurladmin}/${quizId}`);
  }

  updateQuizStatus(quizId: string, status: string): Observable<Quiz> {
    return this.http.patch<Quiz>(`${this.getquizurladmin}/${quizId}`, { status });
  }

  updateQuizAdmin(quizId: string, updates: Partial<Quiz>): Observable<Quiz> {
    return this.http.put<Quiz>(`${this.getquizurladmin}/${quizId}`, updates);
  }

  submitQuizResponse(response: any): Observable<any> {
    return this.http.post('http://localhost:3000/api/userResponse', response);
  }

  getUserResponses(userId: string): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.apiUrl}/userResponsebyuser/${userId}`);
  }
}
