import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { NivelBadge } from '../nivel-badge.component';
import { PacienteProto } from '../prototype-data';

type Aba = 'conversa' | 'resumo' | 'pauta';

// PROTÓTIPO DESCARTÁVEL. Variante B: abre em "Alertas de hoje" (o que pede ação primeiro); o paciente é
// uma página com abas Conversa, Resumo diário e Pauta.
@Component({
  selector: 'psi-proto-psicologo-b',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, HlmButton, HlmTableImports, NivelBadge],
  providers: [provideIcons({ lucideArrowLeft })],
  template: `
    <main class="mx-auto max-w-4xl px-4 py-8">
      @if (!paciente()) {
        <h1 class="text-3xl font-semibold">Alertas de hoje</h1>
        @if (alertas().length === 0) {
          <p class="text-muted-foreground mt-4">Nenhum alerta por enquanto.</p>
        }
        <ul class="mt-6 divide-y border-y">
          @for (p of alertas(); track p.id) {
            <li class="flex flex-wrap items-center gap-x-6 gap-y-3 py-5" [class.bg-status-risco-linha]="p.nivel === 'risco'">
              <div class="min-w-0 flex-1 ps-3">
                <p class="flex flex-wrap items-center gap-3">
                  <span class="text-lg font-semibold">{{ p.nome }}</span>
                  <psi-proto-nivel [nivel]="p.nivel" />
                  <span class="text-muted-foreground text-sm tabular-nums">{{ p.ultima }}</span>
                </p>
                <p class="mt-1.5 max-w-prose">“{{ trecho(p) }}”</p>
              </div>
              <button hlmBtn class="me-3" [variant]="p.nivel === 'risco' ? 'default' : 'outline'" (click)="abrir(p.id)">
                Abrir conversa<span class="sr-only"> de {{ p.nome }}</span>
              </button>
            </li>
          }
        </ul>

        <h2 class="mt-12 text-xl font-semibold">Todos os pacientes</h2>
        <div hlmTableContainer class="mt-3">
          <table hlmTable>
            <thead hlmTHead>
              <tr hlmTr>
                <th hlmTh scope="col">Paciente</th>
                <th hlmTh scope="col">Última mensagem</th>
                <th hlmTh scope="col">Humor</th>
                <th hlmTh scope="col"><span class="sr-only">Ação</span></th>
              </tr>
            </thead>
            <tbody hlmTBody>
              @for (p of pacientes(); track p.id) {
                <tr hlmTr>
                  <th scope="row" hlmTd class="text-start font-medium">{{ p.nome }}</th>
                  <td hlmTd class="tabular-nums">{{ p.ultima }}</td>
                  <td hlmTd>{{ p.humor }}</td>
                  <td hlmTd class="text-end"><button hlmBtn size="sm" variant="ghost" (click)="abrir(p.id)">Abrir<span class="sr-only"> {{ p.nome }}</span></button></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <button hlmBtn variant="ghost" size="sm" (click)="voltar()">
          <ng-icon name="lucideArrowLeft" aria-hidden="true" />Alertas de hoje
        </button>
        <header class="mt-4 flex flex-wrap items-center gap-3">
          <h1 class="text-3xl font-semibold">{{ paciente()!.nome }}</h1>
          <psi-proto-nivel [nivel]="paciente()!.nivel" />
        </header>

        <div role="tablist" aria-label="Seções do paciente" class="mt-6 flex gap-1 border-b">
          @for (a of abas; track a.id) {
            <button
              role="tab"
              type="button"
              class="-mb-px border-b-2 px-4 py-2.5 font-semibold"
              [class]="aba() === a.id ? 'border-primary text-foreground' : 'text-muted-foreground border-transparent'"
              [attr.aria-selected]="aba() === a.id"
              (click)="aba.set(a.id)"
            >{{ a.nome }}</button>
          }
        </div>

        <section role="tabpanel" class="mt-6">
          @switch (aba()) {
            @case ('conversa') {
              @for (d of paciente()!.dias; track d.dia) {
                <h2 class="text-muted-foreground mt-4 mb-2 text-sm font-semibold">{{ d.dia }}</h2>
                <ol class="space-y-2">
                  @for (m of d.mensagens; track m.id) {
                    <li
                      class="max-w-[85%] rounded-lg px-4 py-2.5"
                      [class]="m.de === 'agente' ? 'bg-muted' : 'ms-auto bg-secondary'"
                      [class.bg-status-risco-linha]="m.nivel === 'risco'"
                    >
                      <p class="text-muted-foreground flex items-center gap-2 text-sm">
                        <span class="tabular-nums">{{ m.hora }}</span>
                        <span>{{ m.de === 'agente' ? (m.fixa ? 'Agente · resposta fixa' : 'Agente') : 'Paciente' }}</span>
                        @if (m.nivel === 'risco' || m.nivel === 'atencao') { <psi-proto-nivel [nivel]="m.nivel" /> }
                      </p>
                      <p>{{ m.texto }}</p>
                    </li>
                  }
                </ol>
              }
              @if (paciente()!.dias.length === 0) { <p class="text-muted-foreground">Ainda não há conversa.</p> }
            }
            @case ('resumo') {
              @for (d of paciente()!.dias; track d.dia) {
                <article class="mb-6 max-w-prose">
                  <h2 class="text-lg font-semibold">{{ d.dia }}</h2>
                  <p class="text-muted-foreground text-sm">Humor {{ d.humor }} de 5 ({{ d.humorRotulo }}) · tarefas {{ d.tarefasFeitas }} de {{ d.tarefasTotal }}</p>
                  <p class="mt-2">{{ d.resumo }}</p>
                </article>
              }
              <p class="text-muted-foreground text-sm">Resumos gerados sob demanda. Não são conclusão clínica.</p>
            }
            @case ('pauta') {
              <ul class="max-w-prose list-disc space-y-3 ps-5 text-lg">
                @for (item of paciente()!.pauta; track item) { <li>{{ item }}</li> }
              </ul>
            }
          }
        </section>
      }
    </main>
  `,
})
export class PsicologoB {
  readonly pacientes = input.required<PacienteProto[]>();
  protected readonly aberto = signal<string | null>(null);
  protected readonly aba = signal<Aba>('conversa');
  protected readonly abas: { id: Aba; nome: string }[] = [
    { id: 'conversa', nome: 'Conversa' },
    { id: 'resumo', nome: 'Resumo diário' },
    { id: 'pauta', nome: 'Pauta' },
  ];

  protected readonly alertas = computed(() => this.pacientes().filter((p) => p.nivel !== 'nenhum'));
  protected readonly paciente = computed(() => this.pacientes().find((p) => p.id === this.aberto()) ?? null);

  protected trecho(p: PacienteProto): string {
    const m = p.dias[0]?.mensagens.find((x) => x.nivel === p.nivel);
    return m?.texto ?? '';
  }
  protected abrir(id: string): void {
    this.aba.set('conversa');
    this.aberto.set(id);
  }
  protected voltar(): void {
    this.aberto.set(null);
  }
}
