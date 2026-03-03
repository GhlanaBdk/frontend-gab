import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-gabs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-gabs.component.html',
  styleUrl: './admin-gabs.component.css'
})
export class AdminGabsComponent implements OnInit {

  gabs: any[] = [];
  loading = true;
  showForm = false;
  error = '';
  success = '';

  newGab = { code: '', location: '' };

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() { this.loadGabs(); }

  loadGabs() {
    this.loading = true;
    this.adminService.getGabs().subscribe({
      next: (data) => { this.gabs = data; this.loading = false; },
      error: () => this.router.navigate(['/admin/login'])
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.error = '';
    this.success = '';
  }

  createGab() {
    if (!this.newGab.code || !this.newGab.location) {
      this.error = 'Code et localisation sont obligatoires';
      return;
    }
    // ✅ CORRIGÉ : createGab(code, location) — 2 arguments séparés comme dans le service
    this.adminService.createGab(this.newGab.code, this.newGab.location).subscribe({
      next: () => {
        this.success = 'GAB créé avec succès !';
        this.showForm = false;
        this.newGab = { code: '', location: '' };
        this.loadGabs();
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors de la création';
      }
    });
  }

  goTo(page: string) { this.router.navigate(['/admin/' + page]); }

  logout() {
    this.adminService.logout().subscribe({
      next: () => this.router.navigate(['/admin/login']),
      error: () => this.router.navigate(['/admin/login'])
    });
  }
}