import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GabService } from '../../services/gab.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  transactions: any[] = [];
  solde: number = 0;
  loading: boolean = true;
  error: string = '';

  constructor(
    private router: Router,
    private gabService: GabService
  ) {}

  ngOnInit() {
    // Solde réel depuis le backend
    this.gabService.getBalance().subscribe({
      next: (data) => { this.solde = data.balance; },
      error: () => { this.error = 'Impossible de charger le solde'; }
    });

    // Historique réel depuis le backend
    this.gabService.getHistory(0, 10).subscribe({
      next: (data) => {
        this.loading = false;
        this.transactions = data.content || [];
      },
      error: () => {
        this.loading = false;
        this.error = 'Impossible de charger l\'historique';
      }
    });
  }

  // Détermine si crédit (argent entrant)
  isCredit(tx: any): boolean {
    return tx.type === 'DEPOT';
  }

  // ✅ Labels en français
  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'RETRAIT':  'Retrait',
      'DEPOT':    'Dépôt',
      'VIREMENT': 'Virement',
      'CHEQUIER': 'Demande chéquier'
    };
    return labels[type] || type;
  }

  retour() {
    this.router.navigate(['/menu']);
  }
}