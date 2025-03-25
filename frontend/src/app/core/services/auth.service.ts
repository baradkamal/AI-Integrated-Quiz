import { Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users/'; 

  // Using Signal to store authentication state
  private authToken = signal<string | null>(null);
  private user_id = signal<string | null>(null);
  private user_email = signal<string | null>(null);
  

  constructor(private http: HttpClient) {}

  register(data:any): Observable<any> {
    return this.http.post(this.apiUrl + "signup", data);
  }

  login(data:any): Observable<any> {
    return this.http.post(this.apiUrl + "login", data);
  }

  setToken(token: string) {
    this.authToken.set(token);
    localStorage.setItem('authToken', token);
  }

setId(id: any){
  this.user_id.set(id);
  localStorage.setItem('user_id', id);
}

setEmail(email: any){
  this.user_email.set(email);
  localStorage.setItem('user_email', email);
}
}