import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { PdfService } from '../../../services/pdf.service';

@Component({
  selector: 'app-admin-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-transactions.component.html',
  styleUrl: './admin-transactions.component.css'
})
export class AdminTransactionsComponent implements OnInit {
  transactions: any[] = [];
  loading = true;
  exportLoading = false;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private pdfService: PdfService
  ) {}

  ngOnInit() {
    this.adminService.getTransactions().subscribe({
      next: (data) => { this.transactions = data; this.loading = false; },
      error: () => this.router.navigate(['/admin/login'])
    });
  }

  // ✅ Exporter rapport PDF
  async exporterPDF() {
    this.exportLoading = true;
    await this.pdfService.rapportTransactions(this.transactions);
    this.exportLoading = false;
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'RETRAIT': 'Retrait', 'DEPOT': 'Dépôt',
      'VIREMENT': 'Virement', 'CHEQUIER': 'Chéquier'
    };
    return labels[type] || type;
  }

  getTypeClass(type: string): string {
    const classes: Record<string, string> = {
      'RETRAIT': 'type-retrait', 'DEPOT': 'type-depot',
      'VIREMENT': 'type-virement', 'CHEQUIER': 'type-chequier'
    };
    return classes[type] || '';
  }

  goTo(page: string) { this.router.navigate(['/admin/' + page]); }

  logout() {
    this.adminService.logout().subscribe({
      next: () => this.router.navigate(['/admin/login']),
      error: () => this.router.navigate(['/admin/login'])
    });
  }
}