import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <div class="app-container">
      <header>
        <h1>Memory Game Admin Panel</h1>
      </header>

      <main>
        <router-outlet></router-outlet>
      </main>

      <footer>
        <p>&copy; 2023 Memory Game Admin</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    header {
      background-color: #3f51b5;
      color: white;
      padding: 1rem;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    header h1 {
      margin: 0;
      font-size: 1.5rem;
    }

    main {
      flex: 1;
      padding: 1rem;
    }

    footer {
      background-color: #f5f5f5;
      padding: 1rem;
      text-align: center;
      font-size: 0.8rem;
      color: #666;
    }
  `]
})
export class App {
  protected title = 'memory-admin';
}
