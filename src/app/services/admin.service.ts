import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {

  private base = 'https://backend-gab.onrender.com/api/admin';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const params = new HttpParams().set('username', username).set('password', password);
    return this.http.post(`${this.base}/login`, null, { params, responseType: 'text', withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.base}/logout`, null, { responseType: 'text', withCredentials: true });
  }

  getDashboard(): Observable<any> {
    return this.http.get(`${this.base}/dashboard`, { withCredentials: true });
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.base}/users`, { withCredentials: true });
  }

  createUser(data: any): Observable<any> {
    const params = new HttpParams()
      .set('fullName', data.fullName)
      .set('email', data.email || '')
      .set('phone', data.phone || '')
      .set('initialBalance', data.initialBalance)
      .set('pin', data.pin);
    return this.http.post(`${this.base}/users/create`, null, { params, withCredentials: true });
  }

  getAccounts(): Observable<any> {
    return this.http.get(`${this.base}/accounts`, { withCredentials: true });
  }

  setAccountStatus(accountId: number, status: string): Observable<any> {
    const params = new HttpParams().set('status', status);
    return this.http.put(`${this.base}/accounts/${accountId}/status`, null, { params, withCredentials: true });
  }

  getCards(): Observable<any> {
    return this.http.get(`${this.base}/cards`, { withCredentials: true });
  }

  blockCard(cardId: number): Observable<any> {
    return this.http.post(`${this.base}/cards/${cardId}/block`, null, { withCredentials: true });
  }

  unblockCard(cardId: number): Observable<any> {
    return this.http.post(`${this.base}/cards/${cardId}/unblock`, null, { withCredentials: true });
  }

  resetPin(cardId: number, newPin: string): Observable<any> {
    const params = new HttpParams().set('newPin', newPin);
    return this.http.post(`${this.base}/cards/${cardId}/reset-pin`, null, { params, withCredentials: true });
  }

  getTransactions(): Observable<any> {
    return this.http.get(`${this.base}/transactions`, { withCredentials: true });
  }

  getChequebooks(): Observable<any> {
    return this.http.get(`${this.base}/chequebooks`, { withCredentials: true });
  }

  processChequebook(id: number, status: string): Observable<any> {
    const params = new HttpParams().set('status', status);
    return this.http.put(`${this.base}/chequebooks/${id}/status`, null, { params, withCredentials: true });
  }

  getGabs(): Observable<any> {
    return this.http.get(`${this.base}/gabs`, { withCredentials: true });
  }

  createGab(code: string, location: string): Observable<any> {
    const params = new HttpParams().set('code', code).set('location', location);
    return this.http.post(`${this.base}/gabs/create`, null, { params, withCredentials: true });
  }
}