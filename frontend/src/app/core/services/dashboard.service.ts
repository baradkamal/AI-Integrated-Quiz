// frontend/src/app/core/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/api';
  
  constructor(private http: HttpClient) { }
  
  getUserDashboardStats(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`);
  }
  
  getQuizzesByCategory(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/categories`);
  }
  
  getLeaderboard(quizId?: string): Observable<any> {
    const url = quizId 
      ? `${this.apiUrl}/leaderboard/${quizId}` 
      : `${this.apiUrl}/leaderboard`;
    return this.http.get<any>(url);
  }
}