import { Routes } from '@angular/router';
import { authGuard, inicioGuard, papelGuard } from './core/guards';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'definir-senha',
    loadComponent: () =>
      import('./features/definir-senha/definir-senha.page').then((m) => m.DefinirSenhaPage),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/app-layout.component').then((m) => m.AppLayout),
    children: [
      { path: '', pathMatch: 'full', canActivate: [inicioGuard], children: [] },
      {
        path: 'primeiros-passos',
        canActivate: [papelGuard('Paciente')],
        loadComponent: () =>
          import('./features/paciente/primeiros-passos.page').then((m) => m.PrimeirosPassosPage),
      },
      {
        path: 'conversa',
        canActivate: [papelGuard('Paciente')],
        loadComponent: () => import('./features/paciente/conversa.page').then((m) => m.ConversaPage),
      },
      {
        path: 'combinados',
        canActivate: [papelGuard('Paciente')],
        loadComponent: () => import('./features/paciente/combinados.page').then((m) => m.CombinadosPage),
      },
      {
        path: 'pacientes',
        canActivate: [papelGuard('Psicologo')],
        loadComponent: () => import('./features/psicologo/pacientes.page').then((m) => m.PacientesPage),
      },
      {
        path: 'pacientes/novo',
        canActivate: [papelGuard('Psicologo')],
        loadComponent: () =>
          import('./features/psicologo/novo-paciente.page').then((m) => m.NovoPacientePage),
      },
      {
        path: 'pacientes/:id',
        canActivate: [papelGuard('Psicologo')],
        loadComponent: () =>
          import('./features/psicologo/paciente-detalhe.page').then((m) => m.PacienteDetalhePage),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
