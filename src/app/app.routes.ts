import { Routes } from '@angular/router';
import { AdminPanelComponent } from './components/admin-panel/admin-panel';

export const routes: Routes = [
  { path: '', component: AdminPanelComponent },
  { path: '**', redirectTo: '' }
];
