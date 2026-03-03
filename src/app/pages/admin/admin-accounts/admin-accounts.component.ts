import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-accounts.component.html',
  styleUrl: './admin-accounts.component.css'
})
export class AdminAccountsComponent implements OnInit {

  accounts: any[] = [];
  loading = true;
  error = '';
  success = '';

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() { this.loadAccounts(); }

  loadAccounts() {
    this.loading = true;
    this.adminService.getAccounts().subscribe({
      next: (data) => { this.accounts = data; this.loading = false; },
      error: () => this.router.navigate(['/admin/login'])
    });
  }

  setStatus(accountId: number, status: string) {
    this.adminService.setAccountStatus(accountId, status).subscribe({
      next: () => {
        this.success = 'Statut mis à jour !';
        this.loadAccounts();
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur';
        setTimeout(() => this.error = '', 3000);
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