import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private base = 'https://backend-gab.onrender.com/api';

  constructor(private http: HttpClient) {}

  login(cardNumber: string, pin: string): Observable<string> {
    const params = new HttpParams().set('cardNumber', cardNumber).set('pin', pin);
    return this.http.post(`${this.base}/auth/login`, null, { params, responseType: 'text', withCredentials: true });
  }

  logout(): Observable<string> {
    return this.http.post(`${this.base}/auth/logout`, null, { responseType: 'text', withCredentials: true });
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('gabId');
  }

  getGabId(): number {
    return Number(sessionStorage.getItem('gabId') || '0');
  }

  setGabId(id: number) {
    sessionStorage.setItem('gabId', id.toString());
  }

  clear() {
    sessionStorage.clear();
  }
}