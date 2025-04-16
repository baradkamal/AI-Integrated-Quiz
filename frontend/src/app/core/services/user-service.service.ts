import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private apiUrl = 'http://localhost:3000/api/'; 
  constructor(private http: HttpClient) { }

  finduserbyid(id: any): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'userbyid/' + id);
  }

  finduserresponsebyid(id: any): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'userResponsebyuser/' + id);
  }

  fetchAllUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'allusers');
  }

  getUsersAdmin(page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}usersadmin?page=${page}&limit=${limit}`);
  }

  createUserAdmin(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}createuser`, user);
  }

  updateUserAdmin(id: any, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}updateuseradmin/${id}`, user);
  }

  deleteUserAdmin(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}deleteuseradmin/${id}`);
  }

  getUserprofile(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}users/profile/${id}`);
  }
}
