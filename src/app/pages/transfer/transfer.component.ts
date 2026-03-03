// ===== transfer.component.ts =====
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GabService } from '../../services/gab.service';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.css'
})
export class TransferComponent {
  beneficiaryRib: string = '';
  amount: number = 0;
  error: string = '';
  success: string = '';
  loading: boolean = false;
  operationReussie = false;
  dernierMontant = 0;
  dernierRib = '';
  gabCode = '';
  quickAmounts = [500, 1000, 2000, 5000];

  constructor(private router: Router, private gabService: GabService, private pdfService: PdfService) {}

  selectAmount(val: number) { this.amount = val; this.error = ''; }

  valider() {
    this.error = ''; this.success = '';
    if (!this.beneficiaryRib.trim()) { this.error = 'Veuillez saisir le RIB du bénéficiaire'; return; }
    if (this.amount <= 0) { this.error = 'Veuillez saisir un montant valide'; return; }
    this.loading = true;
    const gabId = Number(sessionStorage.getItem('gabId') || '3');
    this.gabCode = sessionStorage.getItem('gabCode') || `GAB-${gabId}`;

    this.gabService.transfer(gabId, this.beneficiaryRib.trim(), this.amount).subscribe({
      next: () => {
        this.loading = false;
        this.dernierMontant = this.amount;
        this.dernierRib = this.beneficiaryRib;
        this.operationReussie = true;
        this.success = `✅ Virement de ${this.amount} UM vers ${this.beneficiaryRib} effectué !`;
        // ❌ PAS de téléchargement automatique
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.message || err.error || '';
        if (msg.includes('Solde insuffisant')) this.error = 'Solde insuffisant pour ce virement';
        else if (msg.includes('bénéficiaire introuvable')) this.error = 'RIB bénéficiaire introuvable';
        else this.error = msg || 'Erreur lors du virement';
      }
    });
  }

  telechargerTicket() {
    this.pdfService.ticketVirement({
      montant: this.dernierMontant,
      ribBeneficiaire: this.dernierRib,
      gabCode: this.gabCode,
      date: new Date()
    });
  }

  retour() { this.router.navigate(['/menu']); }
}