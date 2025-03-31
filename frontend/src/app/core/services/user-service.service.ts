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
}
