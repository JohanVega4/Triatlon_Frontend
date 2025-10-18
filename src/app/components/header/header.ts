import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginModalService } from '../../services/login-modal.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header implements OnInit, OnDestroy {
  isMenuOpen = false;
  showAdminModal = false;
  
  isAuthenticated$: Observable<boolean>;
  isAdmin$: Observable<boolean>;

  username = '';
  password = '';
  loginError = '';

  private modalSubscription?: Subscription;

  constructor(private router: Router, public authService: AuthService, private loginModalService: LoginModalService) {
    this.isAuthenticated$ = this.authService.currentUser.pipe(map(user => !!user));
    this.isAdmin$ = this.authService.currentUser.pipe(map(user => user?.es_admin ?? false));

    this.router.events.subscribe(() => {
      this.isMenuOpen = false;
    });
  }

  ngOnInit(): void {
    // Suscribirse al servicio del modal para controlar su visibilidad
    this.modalSubscription = this.loginModalService.showModal$.subscribe(
      (show) => {
        this.showAdminModal = show;
        if (show) {
          // Limpiar campos cuando se abre el modal
          this.username = '';
          this.password = '';
          this.loginError = '';
        }
      }
    );
  }

  ngOnDestroy(): void {
    // Limpiar suscripción para evitar memory leaks
    if (this.modalSubscription) {
      this.modalSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  openAdminModal(): void {
    this.loginModalService.openModal();
  }

  closeAdminModal(): void {
    this.loginModalService.closeModal();
  }

  onAdminLogin(): void {
    if (!this.username || !this.password) {
      this.loginError = 'Por favor ingrese usuario y contraseña';
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.loginModalService.closeModal();
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        this.loginError = 'Credenciales incorrectas';
        console.error('Error de login:', error);
      }
    });
  }

  scrollToSection(sectionId: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    this.isMenuOpen = false;

    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
}