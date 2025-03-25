import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl ='http://localhost:3000/api/question';
  
  constructor(private http: HttpClient) { }

  fetchquestion(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

 
  findQuestionbyid(ids: string[]): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'byid', { ids });
  }
}
