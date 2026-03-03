import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private base = 'http://localhost:8084/api/admin';

  constructor(private http: HttpClient) {}

  // ===== AUTH =====
  login(username: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set('username', username)
      .set('password', password);
    return this.http.post(`${this.base}/login`, null,
      { params, responseType: 'text', withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.base}/logout`, null,
      { responseType: 'text', withCredentials: true });
  }

  // ===== DASHBOARD =====
  getDashboard(): Observable<any> {
    return this.http.get(`${this.base}/dashboard`,
      { withCredentials: true });
  }

  // ===== USERS =====
  getUsers(): Observable<any> {
    return this.http.get(`${this.base}/users`,
      { withCredentials: true });
  }

  // ✅ CORRIGÉ : POST /users/create (pas /users)
  createUser(data: any): Observable<any> {
    const params = new HttpParams()
      .set('fullName', data.fullName)
      .set('email', data.email || '')
      .set('phone', data.phone || '')
      .set('initialBalance', data.initialBalance)
      .set('pin', data.pin);
    return this.http.post(`${this.base}/users/create`, null,
      { params, withCredentials: true });
  }

  // ===== ACCOUNTS =====
  getAccounts(): Observable<any> {
    return this.http.get(`${this.base}/accounts`,
      { withCredentials: true });
  }

  setAccountStatus(accountId: number, status: string): Observable<any> {
    const params = new HttpParams().set('status', status);
    return this.http.put(`${this.base}/accounts/${accountId}/status`, null,
      { params, withCredentials: true });
  }

  // ===== CARDS =====
  getCards(): Observable<any> {
    return this.http.get(`${this.base}/cards`,
      { withCredentials: true });
  }

  // ✅ CORRIGÉ : POST (pas PUT) /cards/{id}/block
  blockCard(cardId: number): Observable<any> {
    return this.http.post(`${this.base}/cards/${cardId}/block`, null,
      { withCredentials: true });
  }

  // ✅ CORRIGÉ : POST (pas PUT) /cards/{id}/unblock
  unblockCard(cardId: number): Observable<any> {
    return this.http.post(`${this.base}/cards/${cardId}/unblock`, null,
      { withCredentials: true });
  }

  // ✅ CORRIGÉ : POST (pas PUT) /cards/{id}/reset-pin
  resetPin(cardId: number, newPin: string): Observable<any> {
    const params = new HttpParams().set('newPin', newPin);
    return this.http.post(`${this.base}/cards/${cardId}/reset-pin`, null,
      { params, withCredentials: true });
  }

  // ===== TRANSACTIONS =====
  getTransactions(): Observable<any> {
    return this.http.get(`${this.base}/transactions`,
      { withCredentials: true });
  }

  // ===== CHEQUEBOOKS =====
  // ✅ CORRIGÉ : /chequebooks (avec s)
  getChequebooks(): Observable<any> {
    return this.http.get(`${this.base}/chequebooks`,
      { withCredentials: true });
  }

  // ✅ CORRIGÉ : PUT /chequebooks/{id}/status
  processChequebook(id: number, status: string): Observable<any> {
    const params = new HttpParams().set('status', status);
    return this.http.put(`${this.base}/chequebooks/${id}/status`, null,
      { params, withCredentials: true });
  }

  // ===== GABS =====
  getGabs(): Observable<any> {
    return this.http.get(`${this.base}/gabs`,
      { withCredentials: true });
  }

  // ✅ CORRIGÉ : POST /gabs/create (pas /gabs)
  createGab(code: string, location: string): Observable<any> {
    const params = new HttpParams()
      .set('code', code)
      .set('location', location);
    return this.http.post(`${this.base}/gabs/create`, null,
      { params, withCredentials: true });
  }
}