import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Quiz } from '../../interfaces/quiz';


@Injectable({
  providedIn: 'root'
})
export class QuizServiceService {
  private getquizurl = 'http://localhost:3000/api/quiz';
  private getquizbyid = 'http://localhost:3000/api/quizbyid';
  private getquizbyids = 'http://localhost:3000/api/quizbyids';
  
  constructor(private http: HttpClient) { }

  fetchQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(this.getquizurl);
  }

  fetchquizbyid(id: any): Observable<Quiz> {
    return this.http.get<Quiz>(this.getquizbyid+ '/'+id);
  }

  fetchquizbyids(quizIds: any): Observable<any[]> {
    return this.http.post<any[]>(this.getquizbyids, { quizIds });
  }

  saveQuiz(quiz:Quiz): Observable<Quiz> {
     return this.http.post<Quiz>(this.getquizurl,quiz);
  }

  deleteQuiz(quiz:any): Observable<Quiz> {
    return this.http.delete<Quiz>(this.getquizurl+'/'+quiz._id);
  }

  
}
