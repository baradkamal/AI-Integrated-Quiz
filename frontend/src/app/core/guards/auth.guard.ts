import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem("authToken");
    const isAdmin = localStorage.getItem("admin") === 'true';
    
    if (token) {
      // Redirect based on admin status if trying to access root
      if (state.url === '/') {
        router.navigateByUrl(isAdmin ? '/deshboard' : '/home');
        return false;
      }
      return true;
    }
  }
  
  router.navigateByUrl("login");
  return false;
};
