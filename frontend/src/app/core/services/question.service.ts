import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl ='http://localhost:3000/api/';
  
  constructor(private http: HttpClient) { }

  getDatabaseQuestions(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}question`); 
  }

  fetchQuestions(params: {
    page?: number;
    limit?: number;
    category?: string;
    difficulty?: string;
    type?: string;
    search?: string;
  } = {}): Observable<any> {
    // Convert params to HttpParams
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.category) httpParams = httpParams.set('category', params.category);
    if (params.difficulty) httpParams = httpParams.set('difficulty', params.difficulty);
    if (params.type) httpParams = httpParams.set('type', params.type);
    if (params.search) httpParams = httpParams.set('search', params.search);

    return this.http.get<any>(`${this.apiUrl}questionadmin`, { params: httpParams });
  }
  

  fetchQuestionAdmin(category: string, difficulty: string): Observable<any[]> {
    const params = new HttpParams()
      .set('category', category)
      .set('difficulty', difficulty);
  
    return this.http.get<any[]>(`${this.apiUrl}questionadmin`, { params });
  }
  
 
  findQuestionbyid(ids: string[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}questionbyid`, { ids });
  }

  deleteQuestion(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}question/${id}`);
  }

  updateQuestion(id: string, question: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}question/${id}`, question);
  } 

  createQuestion(question: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}question`, question);
  }
}
