import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) { }

  /**
   * Login with username and password
   */
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/memory/login`, { username, password })
      .pipe(
        tap((response: any) => {
          if (response && response.token) {
            this.setToken(response.token);
          }
        })
      );
  }

  /**
   * Store the JWT token in localStorage
   */
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Get the JWT token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Check if user is authenticated (has a token)
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Remove the token from localStorage
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
