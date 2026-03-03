import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { GabService } from '../../services/gab.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  cardNumber = '';
  pin = '';
  error = '';
  loading = false;
  gabs: any[] = [];
  selectedGabId: number | null = null;
  loadingGabs = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private gabService: GabService
  ) {}

  ngOnInit() {
    this.gabService.getFirstGab().subscribe({
      next: (data) => {
        this.gabs = data;
        if (data && data.length > 0) {
          this.selectedGabId = Number(data[0].id);
        }
        this.loadingGabs = false;
      },
      error: () => {
        this.loadingGabs = false;
        this.error = 'Impossible de charger les GABs disponibles';
      }
    });
  }

  login() {
    this.error = '';
    if (!this.selectedGabId) { this.error = 'Veuillez sélectionner un GAB'; return; }
    if (!this.cardNumber || this.cardNumber.trim().length === 0) { this.error = 'Veuillez saisir votre numéro de carte'; return; }
    if (!this.pin || this.pin.trim().length === 0) { this.error = 'Veuillez saisir votre code PIN'; return; }

    this.loading = true;
    this.authService.login(this.cardNumber.trim(), this.pin.trim()).subscribe({
      next: () => {
        sessionStorage.setItem('cardNumber', this.cardNumber.trim());
        sessionStorage.setItem('gabId', this.selectedGabId!.toString());

        // ✅ NOUVEAU — sauvegarde le CODE du GAB sélectionné (GAB-001, GAB-002...)
        const gabSelectionne = this.gabs.find(g => Number(g.id) === this.selectedGabId);
        if (gabSelectionne) {
          sessionStorage.setItem('gabCode', gabSelectionne.code); // ex: "GAB-001"
        }

        this.loading = false;
        this.router.navigate(['/menu']);
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error;
        if (typeof msg === 'string') {
          if (msg.includes('Card not found'))    this.error = 'Numéro de carte introuvable';
          else if (msg.includes('Invalid PIN'))  this.error = 'Code PIN incorrect';
          else if (msg.includes('Card blocked')) this.error = 'Carte bloquée — contactez votre banque';
          else if (msg.includes('Card expired')) this.error = 'Carte expirée — contactez votre banque';
          else this.error = msg;
        } else {
          this.error = 'Erreur de connexion. Vérifiez vos informations.';
        }
      }
    });
  }
}