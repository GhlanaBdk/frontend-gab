import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-chequebook',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-chequebook.component.html',
  styleUrl: './admin-chequebook.component.css'
})
export class AdminChequebookComponent implements OnInit {

  requests: any[] = [];
  loading = true;
  error = '';
  success = '';

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() { this.loadRequests(); }

  loadRequests() {
    this.loading = true;
    this.adminService.getChequebooks().subscribe({
      next: (data) => { this.requests = data; this.loading = false; },
      error: () => this.router.navigate(['/admin/login'])
    });
  }

  // ✅ CORRIGÉ : utilise processChequebook(id, status) — méthode exacte du service
  setStatus(id: number, status: string) {
    this.adminService.processChequebook(id, status).subscribe({
      next: () => {
        this.success = `Statut mis à jour : ${status}`;
        this.loadRequests();
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur';
        setTimeout(() => this.error = '', 3000);
      }
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'REQUESTED': 'status-requested',
      'APPROVED':  'status-approved',
      'REJECTED':  'status-rejected',
      'DELIVERED': 'status-delivered'
    };
    return map[status] || '';
  }

  goTo(page: string) { this.router.navigate(['/admin/' + page]); }

  logout() {
    this.adminService.logout().subscribe({
      next: () => this.router.navigate(['/admin/login']),
      error: () => this.router.navigate(['/admin/login'])
    });
  }
}