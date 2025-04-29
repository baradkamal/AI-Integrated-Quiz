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
    const userId = localStorage.getItem("user_id");
    
    // If no token, redirect to login
    if (!token) {
      router.navigateByUrl("login");
      return false;
    }

    // If token exists but no user ID, something is wrong - clear auth and redirect to login
    if (!userId) {
      localStorage.clear();
      router.navigateByUrl("login");
      return false;
    }
    
    // Handle root route redirection
    if (state.url === '/') {
      router.navigateByUrl(isAdmin ? '/deshboard' : '/home');
      return false;
    }

    return true;
  }
  
  // If not in browser, allow navigation (for SSR)
  return true;
};
