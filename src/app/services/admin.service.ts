import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private base = 'https://backend-gab.onrender.com/api/admin';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('adminToken');
    return token ? new HttpHeaders({ 'X-Auth-Token': token }) : new HttpHeaders();
  }

  login(username: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set('username', username)
      .set('password', password);
    return this.http.post(`${this.base}/login`, null,
      { params, withCredentials: true }
    ).pipe(
      tap((res: any) => {
        if (res && res.token) {
          sessionStorage.setItem('adminToken', res.token);
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.base}/logout`, null,
      { headers: this.getAuthHeaders(), withCredentials: true }
    ).pipe(tap(() => sessionStorage.removeItem('adminToken')));
  }

  getDashboard(): Observable<any> {
    return this.http.get(`${this.base}/dashboard`,
      { headers: this.getAuthHeaders(), withCredentials: true });
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.base}/users`,
      { headers: this.getAuthHeaders(), withCredentials: true });
  }

  createUser(data: any): Observable<any> {
    const params = new HttpParams()
      .set('fullName', data.fullName)
      .set('email', data.email || '')
      .set('phone', data.phone || '')
      .set('initialBalance', data.initialBalance)
      .set('pin', data.pin);
    return this.http.post(`${this.base}/users/create`, null,
      { params, headers: this.getAuthHeaders(), withCredentials: true });
  }

  getAccounts(): Observable<any> {
    return this.http.get(`${this.base}/accounts`,
      { headers: this.getAuthHeaders(), withCredentials: true });
  }

  setAccountStatus(accountId: number, status: string): Observable<any> {
    const params = new HttpParams().set('status', status);
    return this.http.put(`${this.base}/accounts/${accountId}/status`, null,
      { params, headers: this.getAuthHeaders(), withCredentials: true });
  }

  getCards(): Observable<any> {
    return this.http.get(`${this.base}/cards`,
      { headers: this.getAuthHeaders(), withCredentials: true });
  }

  blockCard(cardId: number): Observable<any> {
    return this.http.post(`${this.base}/cards/${cardId}/block`, null,
      { headers: this.getAuthHeaders(), withCredentials: true });
  }

  unblockCard(cardId: number): Observable<any> {
    return this.http.post(`${this.base}/cards/${cardId}/unblock`, null,
      { headers: this.getAuthHeaders(), withCredentials: true });
  }

  resetPin(cardId: number, newPin: string): Observable<any> {
    const params = new HttpParams().set('newPin', newPin);
    return this.http.post(`${this.base}/cards/${cardId}/reset-pin`, null,
      { params, headers: this.getAuthHeaders(), withCredentials: true });
  }

  getTransactions(): Observable<any> {
    return this.http.get(`${this.base}/transactions`,
      { headers: this.getAuthHeaders(), withCredentials: true });
  }

  getChequebooks(): Observable<any> {
    return this.http.get(`${this.base}/chequebooks`,
      { headers: this.getAuthHeaders(), withCredentials: true });
  }

  processChequebook(id: number, status: string): Observable<any> {
    const params = new HttpParams().set('status', status);
    return this.http.put(`${this.base}/chequebooks/${id}/status`, null,
      { params, headers: this.getAuthHeaders(), withCredentials: true });
  }

  getGabs(): Observable<any> {
    return this.http.get(`${this.base}/gabs`,
      { headers: this.getAuthHeaders(), withCredentials: true });
  }

  createGab(code: string, location: string): Observable<any> {
    const params = new HttpParams()
      .set('code', code)
      .set('location', location);
    return this.http.post(`${this.base}/gabs/create`, null,
      { params, headers: this.getAuthHeaders(), withCredentials: true });
  }
}