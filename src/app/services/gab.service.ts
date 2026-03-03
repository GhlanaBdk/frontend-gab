import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  getFirstGab(): Observable<any[]> {
    return this.http.get<any[]>(`${this.publicBase}/gabs`, { withCredentials: true });
  }

  getBalance(): Observable<{ balance: number }> {
    return this.http.get<{ balance: number }>(`${this.base}/balance`, { withCredentials: true });
  }

  withdraw(gabId: number, amount: number): Observable<any> {
    const params = new HttpParams().set('gabId', gabId).set('amount', amount);
    return this.http.post(`${this.base}/withdraw`, null, { params, withCredentials: true });
  }

  depositCash(gabId: number, items: CashItem[]): Observable<any> {
    const params = new HttpParams().set('gabId', gabId);
    return this.http.post(`${this.base}/deposit/cash`, items, { params, withCredentials: true });
  }

  getHistory(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get(`${this.base}/history`, { params, withCredentials: true });
  }

  requestChequebook(gabId: number, pages: string): Observable<any> {
    const params = new HttpParams().set('gabId', gabId).set('pages', pages);
    return this.http.post(`${this.base}/chequebook`, null, { params, withCredentials: true });
  }

  transfer(gabId: number, beneficiaryRib: string, amount: number): Observable<any> {
    const params = new HttpParams().set('gabId', gabId).set('beneficiaryRib', beneficiaryRib).set('amount', amount);
    return this.http.post(`${this.base}/transfer`, null, { params, withCredentials: true });
  }
}