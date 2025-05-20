import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

interface LoginResponse {
  token: string;
  user: any;
}

interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://cotp-api.onrender.com';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient) {
    this.checkAuthStatus();
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/api/auth/login`, { username, password })
      .pipe(
        tap(response => {
          this.handleAuthentication(response.token, response.user);
        }),
        catchError(error => {
          return throwError(() => new Error(error.error?.message || 'Login failed'));
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    this.currentUserSubject.next(null);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role) || false;
  }

  private handleAuthentication(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(user));
    this.currentUserSubject.next(user);

    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const expirationDate = new Date(tokenData.exp * 1000);
      const expiresIn = expirationDate.getTime() - new Date().getTime();
      this.autoLogout(expiresIn);
    } catch (e) {
      console.error('Error parsing token:', e);
    }
  }

  private checkAuthStatus(): void {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (!token || !userData) {
      return;
    }

    try {
      const user = JSON.parse(userData);
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const expirationDate = new Date(tokenData.exp * 1000);
      
      if (expirationDate <= new Date()) {
        this.logout();
        return;
      }
      
      this.currentUserSubject.next(user);
      const expiresIn = expirationDate.getTime() - new Date().getTime();
      this.autoLogout(expiresIn);
    } catch (e) {
      console.error('Error checking auth status:', e);
      this.logout();
    }
  }

  private autoLogout(expiresIn: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expiresIn);
  }
}
