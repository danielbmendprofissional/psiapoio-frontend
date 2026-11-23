import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Shell, ShellItem } from './shell.component';

const MENU_PSICOLOGO: ShellItem[] = [
  { rotulo: 'Pacientes', icone: 'lucideUsers', rota: '/pacientes' },
  { rotulo: 'Cadastrar paciente', icone: 'lucideUserPlus', rota: '/pacientes/novo' },
];
const MENU_PACIENTE: ShellItem[] = [
  { rotulo: 'Conversa', icone: 'lucideMessageCircle', rota: '/conversa' },
  { rotulo: 'Meus combinados', icone: 'lucideListChecks', rota: '/combinados' },
];

/** Menu por papel (F0): o que cada perfil enxerga vem do papel do usuário logado. */
@Component({
  selector: 'psi-app-layout',
  imports: [Shell],
  template: `<psi-shell [usuario]="info()" [itens]="itens()" (sair)="auth.sair()" />`,
})
export class AppLayout {
  protected readonly auth = inject(AuthService);

  protected readonly itens = computed(() =>
    this.auth.usuario()?.papel === 'Psicologo' ? MENU_PSICOLOGO : MENU_PACIENTE,
  );
  protected readonly info = computed(() => {
    const u = this.auth.usuario();
    return { nome: u?.nome ?? '', papel: u?.papel === 'Psicologo' ? 'Psicólogo' : 'Paciente' };
  });
}
