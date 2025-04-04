import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Quiz } from '../../interfaces/quiz';

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
  private getquizurl = 'http://localhost:3000/api/adminadvancequiz';
  private getquizurladmin = 'http://localhost:3000/api/Advancequiz';
  private getquizbyid = 'http://localhost:3000/api/quizbyid';
  private getquizbyids = 'http://localhost:3000/api/quizbyids';
  
  constructor(private http: HttpClient) { }

  fetchQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(this.getquizurl);
  }

  fetchQuizzesadmin(page: number = 1, limit: number = 10): Observable<QuizResponse> {
    return this.http.get<QuizResponse>(`${this.getquizurl}?page=${page}&limit=${limit}`);
  }

  fetchquizbyid(id: any): Observable<Quiz> {
    return this.http.get<Quiz>(this.getquizurladmin+ '/'+id);
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
  
}
