import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CashItem {
  denomination: number;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class GabService {
  private base      = 'http://localhost:8084/api/client';
  private adminBase = 'http://localhost:8084/api/admin';
  private publicBase = 'http://localhost:8084/api/public'; // ✅ NOUVEAU

  constructor(private http: HttpClient) {}

  // ✅ CORRIGÉ : URL publique — accessible SANS session (page login)
  getFirstGab(): Observable<any[]> {
    return this.http.get<any[]>(`${this.publicBase}/gabs`,
      { withCredentials: true });
  }

  // ===== BALANCE =====
  getBalance(): Observable<{ balance: number }> {
    return this.http.get<{ balance: number }>(`${this.base}/balance`,
      { withCredentials: true });
  }

  // ===== RETRAIT =====
  withdraw(gabId: number, amount: number): Observable<any> {
    const params = new HttpParams()
      .set('gabId', gabId)
      .set('amount', amount);
    return this.http.post(`${this.base}/withdraw`, null,
      { params, withCredentials: true });
  }

  // ===== DÉPÔT =====
  depositCash(gabId: number, items: CashItem[]): Observable<any> {
    const params = new HttpParams().set('gabId', gabId);
    return this.http.post(`${this.base}/deposit/cash`, items,
      { params, withCredentials: true });
  }

  // ===== HISTORIQUE =====
  getHistory(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get(`${this.base}/history`,
      { params, withCredentials: true });
  }

  // ===== CHÉQUIER =====
  requestChequebook(gabId: number, pages: string): Observable<any> {
    const params = new HttpParams()
      .set('gabId', gabId)
      .set('pages', pages);
    return this.http.post(`${this.base}/chequebook`, null,
      { params, withCredentials: true });
  }

  // ===== VIREMENT =====
  transfer(gabId: number, beneficiaryRib: string, amount: number): Observable<any> {
    const params = new HttpParams()
      .set('gabId', gabId)
      .set('beneficiaryRib', beneficiaryRib)
      .set('amount', amount);
    return this.http.post(`${this.base}/transfer`, null,
      { params, withCredentials: true });
  }
}