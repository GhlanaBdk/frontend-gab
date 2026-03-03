import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],  // ✅ RouterLink obligatoire pour [routerLink]
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        sessionStorage.clear();
        this.router.navigate(['/login']);
      },
      error: () => {
        // Même si le logout backend échoue, on vide la session et on redirige
        sessionStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }
}