import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenTriviaService {
  private apiUrl = 'https://opentdb.com/';
  constructor(private http: HttpClient) { }

  getQuestionsWithCategory(category: number, type: string): Observable<any> {
    const apiUrl = `${this.apiUrl}api.php?amount=50&category=${category}&type=${type}`;
    return this.http.get<any>(apiUrl);
  }

  
  getQuestions(): Observable<any> {
    const apiUrl = `${this.apiUrl}api.php?amount=50`;
    return this.http.get<any>(apiUrl);
  }

  
  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}api_category.php`);
  }
}
