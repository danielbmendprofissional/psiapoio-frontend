import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSend } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmLabel } from '@spartan-ng/helm/label';
import { Msg, PSICOLOGA } from '../prototype-data';

// PROTÓTIPO DESCARTÁVEL. Variante C: uma coisa por vez. Consentimento → humor → uma pergunta do agente
// em letra grande e uma caixa de resposta. O histórico fica recolhido.
@Component({
  selector: 'psi-proto-paciente-c',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, HlmButton, HlmLabel],
  providers: [provideIcons({ lucideSend })],
  template: `
    <div class="mx-auto flex min-h-[calc(100dvh-3rem)] max-w-2xl flex-col justify-center gap-8 px-4 py-10">
      @if (!consentido()) {
        <h1 class="text-4xl font-semibold">Este espaço é seu, e {{ psicologa }} também lê</h1>
        <p class="text-xl">
          O que você escrever aqui é lido pela sua psicóloga, que recebe um aviso se algo pedir
          atenção. Eu não sou terapeuta: só lembro das suas tarefas e anoto seu humor.
        </p>
        <button hlmBtn size="lg" class="self-start" (click)="aceitar.emit()">Entendi, quero continuar</button>
      } @else if (humor() === null) {
        <h1 class="text-4xl font-semibold">Como você está agora?</h1>
        <div class="grid gap-3 sm:grid-cols-5" role="group" aria-label="Humor de 1 a 5">
          @for (o of opcoes; track o.n) {
            <button hlmBtn variant="outline" size="lg" class="h-auto flex-col gap-0.5 py-4" (click)="registrarHumor.emit(o.n)">
              <span class="text-2xl font-semibold tabular-nums">{{ o.n }}</span>
              <span class="text-sm font-normal">{{ o.rotulo }}</span>
            </button>
          }
        </div>
      } @else {
        <section aria-live="polite">
          @if (ultima(); as u) {
            <p class="text-3xl leading-snug font-medium text-balance">{{ u.texto }}</p>
            @if (u.fixa) {
              <p class="text-muted-foreground mt-3">Esta é uma resposta fixa. {{ psicologa }} foi avisada.</p>
            }
          }
        </section>

        @if (usadas() >= limite()) {
          <p class="bg-muted rounded-md px-4 py-3 text-lg">
            Por hoje é isso. Amanhã a gente continua, e {{ psicologa }} segue vendo tudo.
          </p>
        } @else {
          <form class="space-y-3" (submit)="enviarTexto($event)">
            <label hlmLabel for="msg-c" class="text-base">Sua resposta</label>
            <textarea
              id="msg-c"
              rows="3"
              class="border-input bg-card w-full rounded-md border px-4 py-3 text-lg"
              [value]="texto()"
              (input)="texto.set($any($event.target).value)"
            ></textarea>
            <div class="flex items-center justify-between">
              <button hlmBtn type="submit" size="lg"><ng-icon name="lucideSend" aria-hidden="true" />Enviar</button>
              <span class="text-muted-foreground text-sm tabular-nums">{{ limite() - usadas() }} mensagens restantes hoje</span>
            </div>
          </form>
        }

        <details class="border-t pt-4">
          <summary class="cursor-pointer text-[0.9375rem] font-semibold">Ver o que já conversamos hoje</summary>
          <div class="mt-4 space-y-3">
            @for (m of mensagens(); track m.id) {
              <p [class]="m.de === 'agente' ? 'text-muted-foreground' : 'font-medium'">
                <span class="text-sm">{{ m.hora }} · {{ m.de === 'agente' ? 'Agente' : 'Você' }}</span><br />
                {{ m.texto }}
              </p>
            }
          </div>
        </details>
      }
    </div>
  `,
})
export class PacienteC {
  readonly mensagens = input.required<Msg[]>();
  readonly consentido = input.required<boolean>();
  readonly usadas = input.required<number>();
  readonly limite = input.required<number>();
  readonly humor = input.required<number | null>();
  readonly enviar = output<string>();
  readonly aceitar = output<void>();
  readonly registrarHumor = output<number>();

  protected readonly psicologa = PSICOLOGA;
  protected readonly texto = signal('');
  protected readonly opcoes = [
    { n: 1, rotulo: 'Muito mal' },
    { n: 2, rotulo: 'Mal' },
    { n: 3, rotulo: 'Mais ou menos' },
    { n: 4, rotulo: 'Bem' },
    { n: 5, rotulo: 'Muito bem' },
  ];
  protected readonly ultima = computed(() => [...this.mensagens()].reverse().find((m) => m.de === 'agente'));

  protected enviarTexto(e: Event): void {
    e.preventDefault();
    const t = this.texto().trim();
    if (!t) return;
    this.enviar.emit(t);
    this.texto.set('');
  }
}
