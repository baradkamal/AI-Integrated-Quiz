import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageOcrService {

  private apiUrl = 'http://localhost:3000/api/upload'; 

  constructor(private http: HttpClient) { }

  uploadFileForOCR(file: File): Observable<{ text: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ text: string }>(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('OCR Upload Error:', error);
    return throwError(() => new Error(error.error?.message || 'Something went wrong with OCR upload.'));
  }
}
