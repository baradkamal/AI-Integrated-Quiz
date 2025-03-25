import { HttpInterceptorFn } from '@angular/common/http';

const backendUrls = ['http://localhost:3000/api/', 'https://your-other-backend.com'];

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const isBackendRequest = backendUrls.some(url => req.url.startsWith(url));
  if (!isBackendRequest) {
    return next(req);
  }

  const token = localStorage.getItem('authToken');

  const newreq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  })
  return next(newreq);
  
};
