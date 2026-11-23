import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { NivelBadge } from '../nivel-badge.component';
import { PacienteProto } from '../prototype-data';

// PROTÓTIPO DESCARTÁVEL. Variante C: o paciente como linha do tempo por dia. Cada dia abre com humor,
// tarefas e Resumo diário; as mensagens ficam recolhidas, exceto as de atenção/risco. A Pauta fecha a página.
@Component({
  selector: 'psi-proto-psicologo-c',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NivelBadge],
  template: `
    <main class="mx-auto max-w-3xl px-4 py-8">
      <h1 class="text-3xl font-semibold">Acompanhamentos</h1>
      <div role="tablist" aria-label="Pacientes" class="mt-5 flex flex-wrap gap-2">
        @for (p of pacientes(); track p.id) {
          <button
            role="tab"
            type="button"
            class="flex items-center gap-2 rounded-md border px-3 py-2 font-medium"
            [class]="id() === p.id ? 'bg-accent border-primary' : 'bg-card'"
            [class.bg-status-risco-linha]="p.nivel === 'risco' && id() !== p.id"
            [attr.aria-selected]="id() === p.id"
            (click)="id.set(p.id)"
          >
            {{ p.nome }} <psi-proto-nivel [nivel]="p.nivel" />
          </button>
        }
      </div>

      <header class="mt-10">
        <h2 class="text-2xl font-semibold">{{ p().nome }}</h2>
        @if (p().alertaTexto) { <p class="mt-1">{{ p().alertaTexto }}</p> }
      </header>

      @for (d of p().dias; track d.dia) {
        <section class="mt-8 border-t pt-6" [attr.aria-label]="d.dia">
          <div class="flex flex-wrap items-baseline justify-between gap-2">
            <h3 class="text-xl font-semibold">{{ d.dia }}</h3>
            <p class="text-muted-foreground flex items-center gap-3 text-sm">
              <span class="flex items-center gap-2">
                Humor
                <span class="flex gap-0.5" role="img" [attr.aria-label]="d.humor + ' de 5, ' + d.humorRotulo">
                  @for (n of [1, 2, 3, 4, 5]; track n) {
                    <span class="h-2.5 w-4 rounded-sm" [class]="n <= d.humor ? 'bg-primary' : 'bg-muted'"></span>
                  }
                </span>
                {{ d.humorRotulo }}
              </span>
              <span class="tabular-nums">Tarefas {{ d.tarefasFeitas }}/{{ d.tarefasTotal }}</span>
            </p>
          </div>
          <p class="mt-3 max-w-prose text-lg">{{ d.resumo }}</p>

          @for (m of destaques(d.mensagens); track m.id) {
            <div class="mt-3 rounded-md px-4 py-3" [class]="m.nivel === 'risco' ? 'bg-status-risco-linha' : 'bg-status-atencao-bg'">
              <p class="flex items-center gap-2 text-sm">
                <span class="tabular-nums">{{ m.hora }}</span> Paciente <psi-proto-nivel [nivel]="m.nivel!" />
              </p>
              <p class="mt-1">{{ m.texto }}</p>
            </div>
          }

          <details class="mt-3">
            <summary class="cursor-pointer text-[0.9375rem] font-semibold">Ver as {{ d.mensagens.length }} mensagens do dia</summary>
            <ol class="mt-3 space-y-2">
              @for (m of d.mensagens; track m.id) {
                <li class="grid grid-cols-[3.5rem_1fr] gap-3">
                  <span class="text-muted-foreground text-sm tabular-nums">{{ m.hora }}</span>
                  <p><span class="font-semibold">{{ m.de === 'agente' ? 'Agente' : 'Paciente' }}:</span> {{ m.texto }}</p>
                </li>
              }
            </ol>
          </details>
        </section>
      } @empty {
        <p class="text-muted-foreground mt-8 text-lg">Ainda não há conversa.</p>
      }

      @if (p().pauta.length) {
        <section class="mt-10 border-t pt-6">
          <h3 class="text-xl font-semibold">Para a próxima sessão</h3>
          <ul class="mt-3 max-w-prose list-disc space-y-2 ps-5">
            @for (item of p().pauta; track item) { <li>{{ item }}</li> }
          </ul>
        </section>
      }
    </main>
  `,
})
export class PsicologoC {
  readonly pacientes = input.required<PacienteProto[]>();
  protected readonly id = signal('helena');
  protected readonly p = computed(() => this.pacientes().find((x) => x.id === this.id()) ?? this.pacientes()[0]);

  protected destaques(ms: PacienteProto['dias'][number]['mensagens']) {
    return ms.filter((m) => m.nivel === 'risco' || m.nivel === 'atencao');
  }
}
