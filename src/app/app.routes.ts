import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'amostra',
    loadComponent: () => import('./features/amostra/amostra.page').then((m) => m.AmostraPage),
  },
  { path: '', pathMatch: 'full', redirectTo: 'amostra' },
];
