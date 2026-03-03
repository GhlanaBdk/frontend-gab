import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GabService } from '../../services/gab.service';
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'app-withdraw',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './withdraw.component.html',
  styleUrl: './withdraw.component.css'
})
export class WithdrawComponent {
  amount: number = 0;
  error: string = '';
  success: string = '';
  loading: boolean = false;
  quickAmounts = [100, 200, 500, 1000, 2000];

  // Affiche le bouton PDF après succès
  operationReussie = false;
  dernierMontant = 0;
  gabCode = '';

  constructor(
    private router: Router,
    private gabService: GabService,
    private pdfService: PdfService
  ) {}

  selectAmount(val: number) { this.amount = val; this.error = ''; }

  valider() {
    this.error = '';
    this.success = '';
    if (this.amount <= 0) { this.error = 'Veuillez saisir un montant valide'; return; }
    this.loading = true;
    const gabId = Number(sessionStorage.getItem('gabId') || '3');
    this.gabCode = sessionStorage.getItem('gabCode') || `GAB-${gabId}`;

    this.gabService.withdraw(gabId, this.amount).subscribe({
      next: () => {
        this.loading = false;
        this.dernierMontant = this.amount;
        this.operationReussie = true; // ✅ Affiche le bouton PDF
        this.success = `✅ Retrait de ${this.amount} UM effectué avec succès !`;
        // ❌ PAS de téléchargement automatique
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.message || err.error || '';
        if (msg.includes('Solde insuffisant')) this.error = 'Solde insuffisant pour ce retrait';
        else if (msg.includes('GAB introuvable')) this.error = 'GAB introuvable — reconnectez-vous';
        else this.error = msg || 'Erreur lors du retrait';
      }
    });
  }

  // ✅ Télécharge SEULEMENT si l'utilisateur clique
  telechargerTicket() {
    this.pdfService.ticketRetrait({
      montant: this.dernierMontant,
      gabCode: this.gabCode,
      date: new Date()
    });
  }

  retour() { this.router.navigate(['/menu']); }
}