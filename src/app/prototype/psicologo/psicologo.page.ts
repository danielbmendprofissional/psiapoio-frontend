import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { Shell } from '../../layout/shell.component';
import { PACIENTES } from '../prototype-data';
import { PrototypeSwitcher } from '../prototype-switcher.component';
import { PsicologoA } from './psicologo-a.component';
import { PsicologoB } from './psicologo-b.component';
import { PsicologoC } from './psicologo-c.component';

/**
 * PROTÓTIPO DESCARTÁVEL. Pergunta: como a conversa do paciente volta para o psicólogo (alerta,
 * transcrição, Resumo diário, Pauta)? Três variantes em /prototype/psicologo?variant=A|B|C.
 */
@Component({
  selector: 'psi-proto-psicologo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Shell, PrototypeSwitcher, PsicologoA, PsicologoB, PsicologoC],
  template: `
    <psi-shell [usuario]="usuario" [itens]="itens">
      @switch (variant()) {
        @case ('B') { <psi-proto-psicologo-b [pacientes]="pacientes" /> }
        @case ('C') { <psi-proto-psicologo-c [pacientes]="pacientes" /> }
        @default { <psi-proto-psicologo-a [pacientes]="pacientes" /> }
      }
    </psi-shell>
    <psi-proto-switcher [variants]="variantes" [nomes]="nomes" [current]="variant()" />
  `,
})
export class PsicologoPrototypePage {
  private readonly route = inject(ActivatedRoute);
  protected readonly pacientes = PACIENTES;
  protected readonly usuario = { nome: 'Ana Ribeiro', papel: 'Psicóloga' };
  protected readonly itens = [
    { rotulo: 'Pacientes', icone: 'lucideUsers' },
    { rotulo: 'Alertas', icone: 'lucideBell' },
    { rotulo: 'Cadastrar paciente', icone: 'lucideUserPlus' },
  ];
  protected readonly variantes = ['A', 'B', 'C'];
  protected readonly nomes: Record<string, string> = {
    A: 'Lista + tudo numa tela',
    B: 'Alertas primeiro, abas',
    C: 'Linha do tempo por dia',
  };
  protected readonly variant = toSignal(
    this.route.queryParamMap.pipe(map((p) => p.get('variant') ?? 'A')),
    { initialValue: 'A' },
  );
}
