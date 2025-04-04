import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl ='http://localhost:3000/api/';
  
  constructor(private http: HttpClient) { }

  fetchquestion(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'question');
  }

  fetchQuestionAdmin(category: string, difficulty: string): Observable<any[]> {
    const params = new HttpParams()
      .set('category', category)
      .set('difficulty', difficulty);
  
    return this.http.get<any[]>(`${this.apiUrl}questionadmin`, { params });
  }
  
 
  findQuestionbyid(ids: string[]): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'byid', { ids });
  }
}
