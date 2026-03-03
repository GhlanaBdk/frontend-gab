import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = 'https://backend-gab.onrender.com/api';

  constructor(private http: HttpClient) {}

  getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('authToken');
    return token ? new HttpHeaders({ 'X-Auth-Token': token }) : new HttpHeaders();
  }

  login(cardNumber: string, pin: string): Observable<any> {
    const params = new HttpParams()
      .set('cardNumber', cardNumber)
      .set('pin', pin);
    return this.http.post(`${this.base}/auth/login`, null,
      { params, withCredentials: true }
    ).pipe(
      tap((res: any) => {
        if (res && res.token) {
          sessionStorage.setItem('authToken', res.token);
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.base}/auth/logout`, null,
      { headers: this.getAuthHeaders(), withCredentials: true }
    ).pipe(tap(() => sessionStorage.removeItem('authToken')));
  }

  isLoggedIn(): boolean { return !!sessionStorage.getItem('gabId'); }
  getGabId(): number { return Number(sessionStorage.getItem('gabId') || '0'); }
  setGabId(id: number) { sessionStorage.setItem('gabId', id.toString()); }
  clear() { sessionStorage.clear(); }
}