import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CashItem {
  denomination: number;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class GabService {
  private base       = 'https://backend-gab.onrender.com/api/client';
  private adminBase  = 'https://backend-gab.onrender.com/api/admin';
  private publicBase = 'https://backend-gab.onrender.com/api/public';

  constructor(private http: HttpClient) {}

  // ✅ Token pour mobile
  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('authToken');
    return token ? new HttpHeaders({ 'X-Auth-Token': token }) : new HttpHeaders();
  }

  getFirstGab(): Observable<any[]> {
    return this.http.get<any[]>(`${this.publicBase}/gabs`, { withCredentials: true });
  }

  getBalance(): Observable<{ balance: number }> {
    return this.http.get<{ balance: number }>(`${this.base}/balance`,
      { headers: this.getAuthHeaders(), withCredentials: true });
  }

  withdraw(gabId: number, amount: number): Observable<any> {
    const params = new HttpParams().set('gabId', gabId).set('amount', amount);
    return this.http.post(`${this.base}/withdraw`, null,
      { params, headers: this.getAuthHeaders(), withCredentials: true });
  }

  depositCash(gabId: number, items: CashItem[]): Observable<any> {
    const params = new HttpParams().set('gabId', gabId);
    return this.http.post(`${this.base}/deposit/cash`, items,
      { params, headers: this.getAuthHeaders(), withCredentials: true });
  }

  getHistory(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get(`${this.base}/history`,
      { params, headers: this.getAuthHeaders(), withCredentials: true });
  }

  requestChequebook(gabId: number, pages: string): Observable<any> {
    const params = new HttpParams().set('gabId', gabId).set('pages', pages);
    return this.http.post(`${this.base}/chequebook`, null,
      { params, headers: this.getAuthHeaders(), withCredentials: true });
  }

  transfer(gabId: number, beneficiaryRib: string, amount: number): Observable<any> {
    const params = new HttpParams()
      .set('gabId', gabId)
      .set('beneficiaryRib', beneficiaryRib)
      .set('amount', amount);
    return this.http.post(`${this.base}/transfer`, null,
      { params, headers: this.getAuthHeaders(), withCredentials: true });
  }
}