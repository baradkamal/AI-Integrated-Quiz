import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  
  
  if (isPlatformBrowser(platformId)) {
    const loggedData = localStorage.getItem("authToken");
    if (loggedData !== null) {
      return true;
    }
  }
  
  
  router.navigateByUrl("login");
  return false;
};
