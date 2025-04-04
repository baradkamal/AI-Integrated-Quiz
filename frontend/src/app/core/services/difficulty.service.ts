import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Difficulty {
  _id: string;
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DifficultyService {
  private apiUrl = 'http://localhost:3000/api/difficulty';

  constructor(private http: HttpClient) {}

  getDifficulties(): Observable<Difficulty[]> {
    return this.http.get<Difficulty[]>(this.apiUrl);
  }
} 