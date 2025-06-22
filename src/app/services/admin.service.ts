import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8000';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Get HTTP headers with authorization token
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Get aggregate data: total games, players, and API usage
   */
  getAggregateData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/aggregate`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Get all players information
   */
  getPlayers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/players`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Get games played per day
   */
  getGamesByDate(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/dates`, {
      headers: this.getAuthHeaders()
    });
  }

  /**
   * Get scores for all players
   */
  getScores(): Observable<any> {
    return this.http.get(`${this.apiUrl}/memory/scores`);
  }

  /**
   * Get top scores for all players
   */
  getTopScores(): Observable<any> {
    return this.http.get(`${this.apiUrl}/memory/top-scores`);
  }
}
