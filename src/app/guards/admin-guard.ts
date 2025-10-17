import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated() && this.authService.isAdmin()) {
      return true;
    } else {
      // Redirigir al home y el modal se abrirá desde el header
      this.router.navigate(['/']);
      return false;
    }
  }
}