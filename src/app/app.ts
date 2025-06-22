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
    /* Mobile-first styles */
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    header {
      background-color: #3f51b5;
      color: white;
      padding: 0.75rem;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    header h1 {
      margin: 0;
      font-size: 1.2rem;
    }

    main {
      flex: 1;
      padding: 0.75rem;
    }

    footer {
      background-color: #f5f5f5;
      padding: 0.75rem;
      text-align: center;
      font-size: 0.7rem;
      color: #666;
    }

    /* Tablet styles */
    @media (min-width: 576px) {
      header {
        padding: 0.85rem;
      }

      header h1 {
        font-size: 1.3rem;
      }

      main {
        padding: 0.85rem;
      }

      footer {
        padding: 0.85rem;
        font-size: 0.75rem;
      }
    }

    /* Desktop styles */
    @media (min-width: 992px) {
      header {
        padding: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      header h1 {
        font-size: 1.5rem;
      }

      main {
        padding: 1rem;
      }

      footer {
        padding: 1rem;
        font-size: 0.8rem;
      }
    }
  `]
})
export class App {
  protected title = 'memory-admin';
}
