import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PdfService {

  // ✅ Charge jsPDF dynamiquement depuis CDN (pas besoin de npm install)
  private async getJsPDF(): Promise<any> {
    return new Promise((resolve, reject) => {
      if ((window as any).jspdf) {
        resolve((window as any).jspdf.jsPDF);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload = () => resolve((window as any).jspdf.jsPDF);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // ===== TICKET RETRAIT =====
  async ticketRetrait(data: {
    montant: number;
    gabCode: string;
    date: Date;
    soldeApres?: number;
  }) {
    const jsPDF = await this.getJsPDF();
    const doc = new jsPDF({ unit: 'mm', format: [80, 120] }); // format ticket de caisse
    this.drawTicket(doc, {
      titre: 'RETRAIT',
      icone: '↓',
      couleurTitre: [220, 50, 50],
      lignes: [
        { label: 'Opération', valeur: 'Retrait espèces' },
        { label: 'Montant', valeur: `${data.montant.toLocaleString()} UM`, gras: true },
        { label: 'GAB', valeur: data.gabCode },
        { label: 'Date', valeur: this.formatDate(data.date) },
        { label: 'Heure', valeur: this.formatHeure(data.date) },
        ...(data.soldeApres !== undefined
          ? [{ label: 'Solde restant', valeur: `${data.soldeApres.toLocaleString()} UM` }]
          : [])
      ]
    });
    doc.save(`ticket-retrait-${this.formatFileName(data.date)}.pdf`);
  }

  // ===== TICKET DÉPÔT =====
  async ticketDepot(data: {
    montant: number;
    gabCode: string;
    date: Date;
    billets?: { denomination: number; quantity: number }[];
    soldeApres?: number;
  }) {
    const jsPDF = await this.getJsPDF();
    const doc = new jsPDF({ unit: 'mm', format: [80, 140] });

    const detailBillets: string[] = (data.billets || [])
      .filter(b => b.quantity > 0)
      .map(b => `${b.quantity} × ${b.denomination} UM`);

    this.drawTicket(doc, {
      titre: 'DÉPÔT',
      icone: '↑',
      couleurTitre: [40, 167, 69],
      lignes: [
        { label: 'Opération', valeur: 'Dépôt espèces' },
        { label: 'Montant total', valeur: `${data.montant.toLocaleString()} UM`, gras: true },
        ...(detailBillets.length > 0
          ? detailBillets.map((b, i) => ({ label: i === 0 ? 'Billets' : '', valeur: b }))
          : []),
        { label: 'GAB', valeur: data.gabCode },
        { label: 'Date', valeur: this.formatDate(data.date) },
        { label: 'Heure', valeur: this.formatHeure(data.date) },
        ...(data.soldeApres !== undefined
          ? [{ label: 'Nouveau solde', valeur: `${data.soldeApres.toLocaleString()} UM` }]
          : [])
      ]
    });
    doc.save(`ticket-depot-${this.formatFileName(data.date)}.pdf`);
  }

  // ===== TICKET VIREMENT =====
  async ticketVirement(data: {
    montant: number;
    ribBeneficiaire: string;
    gabCode: string;
    date: Date;
    soldeApres?: number;
  }) {
    const jsPDF = await this.getJsPDF();
    const doc = new jsPDF({ unit: 'mm', format: [80, 120] });
    this.drawTicket(doc, {
      titre: 'VIREMENT',
      icone: '⇄',
      couleurTitre: [23, 115, 232],
      lignes: [
        { label: 'Opération', valeur: 'Virement bancaire' },
        { label: 'Montant', valeur: `${data.montant.toLocaleString()} UM`, gras: true },
        { label: 'Bénéficiaire', valeur: data.ribBeneficiaire },
        { label: 'GAB', valeur: data.gabCode },
        { label: 'Date', valeur: this.formatDate(data.date) },
        { label: 'Heure', valeur: this.formatHeure(data.date) },
        ...(data.soldeApres !== undefined
          ? [{ label: 'Solde restant', valeur: `${data.soldeApres.toLocaleString()} UM` }]
          : [])
      ]
    });
    doc.save(`ticket-virement-${this.formatFileName(data.date)}.pdf`);
  }

  // ===== TICKET CHÉQUIER =====
  async ticketChequier(data: {
    type: string;
    gabCode: string;
    date: Date;
  }) {
    const jsPDF = await this.getJsPDF();
    const doc = new jsPDF({ unit: 'mm', format: [80, 110] });
    const typeLabel = data.type === 'P50' ? '50 chèques' : '100 chèques';
    this.drawTicket(doc, {
      titre: 'CHÉQUIER',
      icone: '✎',
      couleurTitre: [245, 124, 0],
      lignes: [
        { label: 'Opération', valeur: 'Demande de chéquier' },
        { label: 'Type', valeur: typeLabel, gras: true },
        { label: 'Statut', valeur: 'En attente de validation' },
        { label: 'GAB', valeur: data.gabCode },
        { label: 'Date', valeur: this.formatDate(data.date) },
        { label: 'Heure', valeur: this.formatHeure(data.date) },
        { label: 'Délai', valeur: '5 à 7 jours ouvrables' },
      ]
    });
    doc.save(`ticket-chequier-${this.formatFileName(data.date)}.pdf`);
  }

  // ===== RAPPORT ADMIN — TRANSACTIONS =====
  async rapportTransactions(transactions: any[]) {
    const jsPDF = await this.getJsPDF();
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const now = new Date();

    // En-tête
    doc.setFillColor(26, 46, 74);
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('GAB MAURITANIE — RAPPORT TRANSACTIONS', 105, 12, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Généré le ${this.formatDate(now)} à ${this.formatHeure(now)}`, 105, 22, { align: 'center' });

    // Stats résumé
    let y = 36;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Résumé', 14, y);
    y += 6;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total transactions : ${transactions.length}`, 14, y); y += 5;

    const retraits = transactions.filter(t => t.type === 'RETRAIT');
    const depots = transactions.filter(t => t.type === 'DEPOT');
    const virements = transactions.filter(t => t.type === 'VIREMENT');
    const totalRetrait = retraits.reduce((s, t) => s + (t.amount || 0), 0);
    const totalDepot = depots.reduce((s, t) => s + (t.amount || 0), 0);

    doc.text(`Retraits : ${retraits.length} opérations — ${totalRetrait.toLocaleString()} UM`, 14, y); y += 5;
    doc.text(`Dépôts : ${depots.length} opérations — ${totalDepot.toLocaleString()} UM`, 14, y); y += 5;
    doc.text(`Virements : ${virements.length} opérations`, 14, y); y += 8;

    // Tableau
    doc.setFillColor(26, 46, 74);
    doc.rect(14, y, 182, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('ID', 16, y + 5);
    doc.text('TYPE', 26, y + 5);
    doc.text('COMPTE', 52, y + 5);
    doc.text('MONTANT', 90, y + 5);
    doc.text('GAB', 120, y + 5);
    doc.text('DATE', 148, y + 5);
    y += 7;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    for (const tx of transactions.slice(0, 50)) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      const isEven = transactions.indexOf(tx) % 2 === 0;
      if (isEven) {
        doc.setFillColor(245, 247, 250);
        doc.rect(14, y - 1, 182, 6, 'F');
      }
      doc.setFontSize(7.5);
      doc.text(`#${tx.id}`, 16, y + 4);
      doc.text(tx.type || '—', 26, y + 4);
      doc.text(tx.account?.rib || '—', 52, y + 4);
      doc.text(`${(tx.amount || 0).toLocaleString()} UM`, 90, y + 4);
      doc.text(tx.gab?.code || '—', 120, y + 4);
      doc.text(tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('fr-FR') : '—', 148, y + 4);
      y += 6;
    }

    if (transactions.length > 50) {
      y += 4;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`... et ${transactions.length - 50} transactions supplémentaires`, 14, y);
    }

    doc.save(`rapport-transactions-${this.formatFileName(now)}.pdf`);
  }

  // ===== RAPPORT ADMIN — CHÉQUIERS =====
  async rapportChequiers(chequiers: any[]) {
    const jsPDF = await this.getJsPDF();
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const now = new Date();

    doc.setFillColor(26, 46, 74);
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('GAB MAURITANIE — RAPPORT CHÉQUIERS', 105, 12, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Généré le ${this.formatDate(now)} à ${this.formatHeure(now)}`, 105, 22, { align: 'center' });

    let y = 36;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Résumé', 14, y);
    y += 6;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total demandes : ${chequiers.length}`, 14, y); y += 5;

    const approved = chequiers.filter(c => c.status === 'APPROVED').length;
    const rejected = chequiers.filter(c => c.status === 'REJECTED').length;
    const pending = chequiers.filter(c => c.status === 'REQUESTED').length;
    const delivered = chequiers.filter(c => c.status === 'DELIVERED').length;

    doc.text(`Approuvées : ${approved}  |  Rejetées : ${rejected}  |  En attente : ${pending}  |  Livrées : ${delivered}`, 14, y);
    y += 8;

    doc.setFillColor(26, 46, 74);
    doc.rect(14, y, 182, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('ID', 16, y + 5);
    doc.text('CLIENT', 28, y + 5);
    doc.text('TYPE', 90, y + 5);
    doc.text('STATUT', 115, y + 5);
    doc.text('DATE DEMANDE', 148, y + 5);
    y += 7;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    for (const req of chequiers) {
      if (y > 270) { doc.addPage(); y = 20; }
      const isEven = chequiers.indexOf(req) % 2 === 0;
      if (isEven) {
        doc.setFillColor(245, 247, 250);
        doc.rect(14, y - 1, 182, 6, 'F');
      }
      doc.setFontSize(7.5);
      doc.text(`#${req.id}`, 16, y + 4);
      doc.text((req.clientName || '—').substring(0, 25), 28, y + 4);
      doc.text(req.pages === 'P50' ? '50 chèques' : '100 chèques', 90, y + 4);
      doc.text(req.status || '—', 115, y + 4);
      doc.text(req.requestedAt ? new Date(req.requestedAt).toLocaleDateString('fr-FR') : '—', 148, y + 4);
      y += 6;
    }

    doc.save(`rapport-chequiers-${this.formatFileName(now)}.pdf`);
  }

  // ===== UTILITAIRES PRIVÉS =====
  private drawTicket(doc: any, config: {
    titre: string;
    icone: string;
    couleurTitre: [number, number, number];
    lignes: { label: string; valeur: string; gras?: boolean }[];
  }) {
    const [r, g, b] = config.couleurTitre;

    // En-tête coloré
    doc.setFillColor(r, g, b);
    doc.rect(0, 0, 80, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`${config.icone} ${config.titre}`, 40, 10, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('GAB MAURITANIE', 40, 17, { align: 'center' });

    // Ligne de séparation
    doc.setDrawColor(r, g, b);
    doc.setLineWidth(0.5);
    doc.line(5, 24, 75, 24);

    // Lignes de données
    let y = 31;
    doc.setTextColor(0, 0, 0);

    for (const ligne of config.lignes) {
      if (ligne.label) {
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(ligne.label + ' :', 6, y);
      }

      doc.setFontSize(ligne.gras ? 9 : 8);
      doc.setFont('helvetica', ligne.gras ? 'bold' : 'normal');
      doc.setTextColor(ligne.gras ? r : 30, ligne.gras ? g : 30, ligne.gras ? b : 30);
      doc.text(ligne.valeur, 74, y, { align: 'right' });

      y += 7;
    }

    // Pied de page
    y += 2;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(5, y, 75, y);
    y += 5;
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(130, 130, 130);
    doc.text('Conservez ce ticket comme preuve de votre opération.', 40, y, { align: 'center' });
    y += 4;
    doc.text('Banque de Mauritanie — www.bam.mr', 40, y, { align: 'center' });
  }

  private formatDate(d: Date): string {
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  private formatHeure(d: Date): string {
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  private formatFileName(d: Date): string {
    return d.toISOString().slice(0, 16).replace('T', '-').replace(':', 'h');
  }
}