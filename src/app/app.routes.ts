import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'amostra',
    loadComponent: () => import('./features/amostra/amostra.page').then((m) => m.AmostraPage),
  },
  // PROTÓTIPOS DESCARTÁVEIS (conversa do paciente e retorno ao psicólogo). Não vão para main.
  {
    path: 'prototype/paciente',
    loadComponent: () => import('./prototype/paciente/paciente.page').then((m) => m.PacientePrototypePage),
  },
  {
    path: 'prototype/psicologo',
    loadComponent: () => import('./prototype/psicologo/psicologo.page').then((m) => m.PsicologoPrototypePage),
  },
  { path: '', pathMatch: 'full', redirectTo: 'amostra' },
];
