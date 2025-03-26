import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const backendUrls = ['http://localhost:3000/api/', 'https://your-other-backend.com'];

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const isBackendRequest = backendUrls.some(url => req.url.startsWith(url));
  
  if (!isBackendRequest) {
    return next(req);
  }

  let token: string | null = null;
  if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem('authToken');
  }

  if (!token) {
    return next(req);
  }

  const newreq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return next(newreq);
};
