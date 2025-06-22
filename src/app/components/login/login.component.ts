import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <div *ngIf="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            [(ngModel)]="username"
            required
            autocomplete="username"
          >
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            [(ngModel)]="password"
            required
            autocomplete="current-password"
          >
        </div>
        <button type="submit" [disabled]="!loginForm.form.valid || isLoading">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    h2 {
      text-align: center;
      margin-bottom: 20px;
      color: #333;
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #555;
    }

    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
    }

    button {
      width: 100%;
      padding: 12px;
      background-color: #3f51b5;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    button:hover {
      background-color: #303f9f;
    }

    button:disabled {
      background-color: #9fa8da;
      cursor: not-allowed;
    }

    .error-message {
      background-color: #ffebee;
      color: #c62828;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 15px;
      text-align: center;
    }
  `]
})
export class LoginComponent {
  @Output() loginSuccess = new EventEmitter<void>();

  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.loginSuccess.emit();
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 401) {
          this.errorMessage = 'Invalid username or password';
        } else {
          this.errorMessage = 'An error occurred during login. Please try again.';
        }
        console.error('Login error:', error);
      }
    });
  }
}
