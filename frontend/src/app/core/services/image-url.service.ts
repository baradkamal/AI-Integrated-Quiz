import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageUrlService {
  private backendUrl = 'http://localhost:3000'; // Backend server URL

  constructor() { }

  getFullImageUrl(relativePath: string): string {
    // If the path is already a full URL, return it as is
    if (relativePath.startsWith('http')) {
      return relativePath;
    }

    // If the path starts with /public, append it to the backend URL
    if (relativePath.startsWith('/public')) {
      return `${this.backendUrl}${relativePath}`;
    }

    // If it's just a relative path, assume it's a public asset
    return `${this.backendUrl}/public${relativePath}`;
  }
} 