import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Quiz } from '../../interfaces/quiz';


@Injectable({
  providedIn: 'root'
})
export class QuizServiceService {
  private getquizurl = 'http://localhost:3000/api/quiz';

  constructor(private http: HttpClient) { }

  fetchQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(this.getquizurl);
  }

  saveQuiz(quiz:Quiz): Observable<Quiz> {
     return this.http.post<Quiz>(this.getquizurl,quiz);
  }

  deleteQuiz(quiz:any): Observable<Quiz> {
    return this.http.delete<Quiz>(this.getquizurl+'/'+quiz._id);
  }

  
}
