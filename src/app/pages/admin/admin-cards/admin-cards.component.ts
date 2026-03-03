import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-cards',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-cards.component.html',
  styleUrl: './admin-cards.component.css'
})
export class AdminCardsComponent implements OnInit {

  cards: any[] = [];
  loading = true;
  error = '';
  success = '';
  revealedCards = new Set<number>();
  resetPinCardId: number | null = null;
  newPin: string = '';

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() { this.loadCards(); }

  loadCards() {
    this.loading = true;
    this.adminService.getCards().subscribe({
      next: (data) => {
        this.cards = data;
        this.loading = false;

        // ✅ DEBUG — ouvre F12 Console pour voir la structure exacte
        if (data && data.length > 0) {
          console.log('=== STRUCTURE CARTE #1 ===');
          console.log(JSON.stringify(data[0], null, 2));
          console.log('account:', data[0].account);
          console.log('account.user:', data[0].account?.user);
          console.log('fullName:', data[0].account?.user?.fullName);
        }
      },
      error: () => this.router.navigate(['/admin/login'])
    });
  }

  toggleReveal(cardId: number) {
    if (this.revealedCards.has(cardId)) {
      this.revealedCards.delete(cardId);
    } else {
      this.revealedCards.add(cardId);
    }
  }

  blockCard(cardId: number) {
    this.adminService.blockCard(cardId).subscribe({
      next: () => {
        this.success = 'Carte bloquée !';
        this.loadCards();
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur';
        setTimeout(() => this.error = '', 3000);
      }
    });
  }

  unblockCard(cardId: number) {
    this.adminService.unblockCard(cardId).subscribe({
      next: () => {
        this.success = 'Carte débloquée !';
        this.loadCards();
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur';
        setTimeout(() => this.error = '', 3000);
      }
    });
  }

  openResetPin(cardId: number) {
    this.resetPinCardId = cardId;
    this.newPin = '';
    this.error = '';
  }

  confirmResetPin() {
    if (!this.newPin || this.newPin.length !== 4) {
      this.error = 'Le PIN doit contenir exactement 4 chiffres';
      return;
    }
    this.adminService.resetPin(this.resetPinCardId!, this.newPin).subscribe({
      next: () => {
        this.success = 'PIN réinitialisé !';
        this.resetPinCardId = null;
        this.newPin = '';
        this.loadCards();
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur reset PIN';
        setTimeout(() => this.error = '', 3000);
      }
    });
  }

  cancelResetPin() {
    this.resetPinCardId = null;
    this.newPin = '';
  }

  goTo(page: string) { this.router.navigate(['/admin/' + page]); }

  logout() {
    this.adminService.logout().subscribe({
      next: () => this.router.navigate(['/admin/login']),
      error: () => this.router.navigate(['/admin/login'])
    });
  }
}