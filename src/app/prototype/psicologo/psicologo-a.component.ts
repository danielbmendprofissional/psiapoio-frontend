import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideClock } from '@ng-icons/lucide';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { NivelBadge } from '../nivel-badge.component';
import { PacienteProto } from '../prototype-data';

// PROTÓTIPO DESCARTÁVEL. Variante A: lista fixa à esquerda; à direita transcrição, alerta, resumo e pauta
// do paciente escolhido, tudo numa tela, sem trocar de página.
@Component({
  selector: 'psi-proto-psicologo-a',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, HlmBadge, NivelBadge],
  providers: [provideIcons({ lucideBadgeCheck, lucideClock })],
  template: `
    <div class="grid min-h-[calc(100dvh-3.5rem)] lg:grid-cols-[19rem_1fr]">
      <nav aria-label="Pacientes" class="bg-sidebar border-e">
        <h1 class="px-5 pt-6 pb-3 text-xl font-semibold">Pacientes</h1>
        <ul>
          @for (p of pacientes(); track p.id) {
            <li>
              <button
                type="button"
                class="hover:bg-muted flex w-full flex-col items-start gap-1.5 border-b px-5 py-3 text-start"
                [class.bg-status-risco-linha]="p.nivel === 'risco' && selecionado().id !== p.id"
                [class.bg-accent]="selecionado().id === p.id"
                [attr.aria-current]="selecionado().id === p.id ? 'true' : null"
                (click)="id.set(p.id)"
              >
                <span class="flex w-full items-center justify-between gap-2">
                  <span [class.font-semibold]="p.nivel === 'risco'" class="font-medium">{{ p.nome }}</span>
                  <psi-proto-nivel [nivel]="p.nivel" />
                </span>
                <span class="text-muted-foreground text-sm tabular-nums">{{ p.ultima }}</span>
              </button>
            </li>
          }
        </ul>
      </nav>

      <main class="px-5 py-6 lg:px-10">
        <header class="flex flex-wrap items-center gap-3">
          <h2 class="text-3xl font-semibold">{{ selecionado().nome }}</h2>
          <psi-proto-nivel [nivel]="selecionado().nivel" />
          @if (selecionado().perfilAprovado) {
            <span hlmBadge variant="aprovado"><ng-icon name="lucideBadgeCheck" aria-hidden="true" />Perfil aprovado</span>
          } @else {
            <span hlmBadge variant="pendente"><ng-icon name="lucideClock" aria-hidden="true" />Perfil pendente</span>
          }
        </header>

        @if (selecionado().dias.length === 0) {
          <p class="text-muted-foreground mt-8 max-w-prose text-lg">
            Ainda não há conversa. O agente só liga depois que você aprovar o Perfil do agente.
          </p>
        } @else {
          <div class="mt-6 grid gap-x-10 gap-y-8 xl:grid-cols-[1fr_22rem]">
            <section aria-label="Conversa">
              <h3 class="text-xl font-semibold">Conversa</h3>
              @for (d of selecionado().dias; track d.dia) {
                <h4 class="text-muted-foreground mt-6 mb-2 text-sm font-semibold">{{ d.dia }}</h4>
                <ol class="divide-y">
                  @for (m of d.mensagens; track m.id) {
                    <li
                      class="grid grid-cols-[3.5rem_1fr] gap-3 py-2.5"
                      [class.bg-status-risco-linha]="m.nivel === 'risco'"
                      [class.bg-status-atencao-bg]="m.nivel === 'atencao'"
                    >
                      <span class="text-muted-foreground text-sm tabular-nums">{{ m.hora }}</span>
                      <div>
                        <p>
                          <span class="font-semibold">{{ m.de === 'agente' ? 'Agente' : 'Paciente' }}</span>
                          @if (m.fixa) { <span class="text-muted-foreground text-sm"> · resposta fixa</span> }
                          @if (m.nivel === 'risco' || m.nivel === 'atencao') {
                            <span class="ms-2"><psi-proto-nivel [nivel]="m.nivel" /></span>
                          }
                        </p>
                        <p>{{ m.texto }}</p>
                      </div>
                    </li>
                  }
                </ol>
              }
            </section>

            <aside class="space-y-8" aria-label="Alerta, resumo e pauta">
              @if (selecionado().alertaTexto) {
                <section>
                  <h3 class="text-xl font-semibold">Alerta</h3>
                  <p class="mt-2">{{ selecionado().alertaTexto }}</p>
                </section>
              }
              <section>
                <h3 class="text-xl font-semibold">Resumo diário</h3>
                <p class="mt-2">{{ selecionado().dias[0].resumo }}</p>
                <p class="text-muted-foreground mt-2 text-sm">Gerado sob demanda. Não é conclusão clínica.</p>
              </section>
              <section>
                <h3 class="text-xl font-semibold">Pauta da próxima sessão</h3>
                <ul class="mt-2 list-disc space-y-2 ps-5">
                  @for (item of selecionado().pauta; track item) { <li>{{ item }}</li> }
                </ul>
              </section>
            </aside>
          </div>
        }
      </main>
    </div>
  `,
})
export class PsicologoA {
  readonly pacientes = input.required<PacienteProto[]>();
  protected readonly id = signal('helena');
  protected readonly selecionado = computed(
    () => this.pacientes().find((p) => p.id === this.id()) ?? this.pacientes()[0],
  );
}
