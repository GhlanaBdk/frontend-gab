import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GabService, CashItem } from '../../services/gab.service';
import { PdfService } from '../../services/pdf.service';

interface BilletItem {
  denomination: number;
  quantity: number;
  label: string;
  imgUrl: string;
  fallbackColor: string;
}

@Component({
  selector: 'app-deposit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.css'
})
export class DepositComponent {
  error: string = '';
  success: string = '';
  loading: boolean = false;
  operationReussie = false;
  dernierTotal = 0;
  gabCode = '';
  private billetsUtilises: { denomination: number; quantity: number }[] = [];

  billets: BilletItem[] = [
    { denomination: 50,   quantity: 0, label: '50 UM',   imgUrl: '/assets/billets/billet-50.jpg',   fallbackColor: 'linear-gradient(135deg, #7b68b5, #5a4a90)' },
    { denomination: 100,  quantity: 0, label: '100 UM',  imgUrl: '/assets/billets/billet-100.jpg',  fallbackColor: 'linear-gradient(135deg, #4a9e6e, #2d7a50)' },
    { denomination: 200,  quantity: 0, label: '200 UM',  imgUrl: '/assets/billets/billet-200.jpg',  fallbackColor: 'linear-gradient(135deg, #c8a040, #a07820)' },
    { denomination: 500,  quantity: 0, label: '500 UM',  imgUrl: '/assets/billets/billet-500.jpg',  fallbackColor: 'linear-gradient(135deg, #4a8ec8, #2a68a8)' },
    { denomination: 1000, quantity: 0, label: '1000 UM', imgUrl: '/assets/billets/billet-1000.jpg', fallbackColor: 'linear-gradient(135deg, #c86060, #a04040)' },
  ];

  constructor(private router: Router, private gabService: GabService, private pdfService: PdfService) {}

  get total(): number {
    return this.billets.reduce((sum, b) => sum + b.denomination * b.quantity, 0);
  }

  increment(billet: BilletItem) { billet.quantity++; this.error = ''; }
  decrement(billet: BilletItem) { if (billet.quantity > 0) billet.quantity--; }

  onImageError(event: Event, billet: BilletItem) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent) {
      parent.style.background = billet.fallbackColor;
      parent.innerHTML = `<span style="color:white;font-size:15px;font-weight:900;">${billet.denomination} UM</span>`;
    }
  }

  valider() {
    this.error = ''; this.success = '';
    if (this.total <= 0) { this.error = 'Veuillez insérer au moins un billet'; return; }
    this.loading = true;
    const gabId = Number(sessionStorage.getItem('gabId') || '3');
    this.gabCode = sessionStorage.getItem('gabCode') || `GAB-${gabId}`;
    const items: CashItem[] = this.billets.filter(b => b.quantity > 0).map(b => ({ denomination: b.denomination, quantity: b.quantity }));
    this.billetsUtilises = items.map(i => ({ ...i }));

    this.gabService.depositCash(gabId, items).subscribe({
      next: (res) => {
        this.loading = false;
        this.dernierTotal = res.totalDeposited || this.total;
        this.operationReussie = true;
        this.success = `✅ Dépôt de ${this.dernierTotal} UM effectué avec succès !`;
        // ❌ PAS de téléchargement automatique
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Erreur lors du dépôt';
      }
    });
  }

  telechargerTicket() {
    this.pdfService.ticketDepot({
      montant: this.dernierTotal,
      gabCode: this.gabCode,
      date: new Date(),
      billets: this.billetsUtilises
    });
  }

  retour() { this.router.navigate(['/menu']); }
}