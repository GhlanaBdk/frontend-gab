import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GabService } from '../../services/gab.service';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'app-chequebook',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chequebook.component.html',
  styleUrl: './chequebook.component.css'
})
export class ChequebookComponent {
  selectedType: string = '';
  error: string = '';
  success: string = '';
  loading: boolean = false;
  operationReussie = false;
  gabCode = '';

  types = [
    { code: 'P50',  label: 'Chéquier 50 chèques',  description: 'Format standard',   recommended: false },
    { code: 'P100', label: 'Chéquier 100 chèques', description: 'Format économique', recommended: true  }
  ];

  constructor(private router: Router, private gabService: GabService, private pdfService: PdfService) {}

  select(code: string) { this.selectedType = code; this.error = ''; }

  valider() {
    if (!this.selectedType) { this.error = 'Veuillez sélectionner un type de chéquier'; return; }
    this.loading = true; this.error = '';
    const gabId = Number(sessionStorage.getItem('gabId') || '3');
    this.gabCode = sessionStorage.getItem('gabCode') || `GAB-${gabId}`;

    this.gabService.requestChequebook(gabId, this.selectedType).subscribe({
      next: () => {
        this.loading = false;
        this.operationReussie = true;
        this.success = `✅ Demande de chéquier ${this.selectedType} envoyée avec succès !`;
        // ❌ PAS de téléchargement automatique
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Erreur lors de la demande';
      }
    });
  }

  telechargerTicket() {
    this.pdfService.ticketChequier({
      type: this.selectedType,
      gabCode: this.gabCode,
      date: new Date()
    });
  }

  retour() { this.router.navigate(['/menu']); }
}