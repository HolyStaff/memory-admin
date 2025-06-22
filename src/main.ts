import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Import Chart.js and register required plugins
import { Chart } from 'chart.js';
import { CategoryScale, LinearScale, BarController, BarElement, PieController, ArcElement, LineController, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  PieController,
  ArcElement,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
