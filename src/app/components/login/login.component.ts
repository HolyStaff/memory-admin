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
    /* Mobile-first styles */
    .login-container {
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
      padding: 15px;
      background-color: #fff;
      border-radius: 6px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    h2 {
      text-align: center;
      margin-bottom: 15px;
      color: #333;
      font-size: 1.3rem;
    }

    .form-group {
      margin-bottom: 12px;
    }

    label {
      display: block;
      margin-bottom: 4px;
      font-weight: 500;
      color: #555;
      font-size: 0.9rem;
    }

    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    button {
      width: 100%;
      padding: 10px;
      background-color: #3f51b5;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 14px;
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
      padding: 8px;
      border-radius: 4px;
      margin-bottom: 12px;
      text-align: center;
      font-size: 0.85rem;
    }

    /* Tablet styles */
    @media (min-width: 576px) {
      .login-container {
        max-width: 80%;
        padding: 18px;
        border-radius: 7px;
      }

      h2 {
        margin-bottom: 18px;
        font-size: 1.4rem;
      }

      .form-group {
        margin-bottom: 14px;
      }

      label {
        margin-bottom: 5px;
        font-size: 0.95rem;
      }

      input {
        padding: 9px;
        font-size: 15px;
      }

      button {
        padding: 11px;
        font-size: 15px;
      }

      .error-message {
        padding: 9px;
        margin-bottom: 14px;
        font-size: 0.9rem;
      }
    }

    /* Desktop styles */
    @media (min-width: 992px) {
      .login-container {
        max-width: 400px;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      h2 {
        margin-bottom: 20px;
        font-size: 1.5rem;
      }

      .form-group {
        margin-bottom: 15px;
      }

      label {
        margin-bottom: 5px;
        font-size: 1rem;
      }

      input {
        padding: 10px;
        font-size: 16px;
      }

      button {
        padding: 12px;
        font-size: 16px;
      }

      .error-message {
        padding: 10px;
        margin-bottom: 15px;
        font-size: 1rem;
      }
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
