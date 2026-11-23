import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideSend } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { Msg, PSICOLOGA, Tarefa } from '../prototype-data';

// PROTÓTIPO DESCARTÁVEL. Variante B: chat ao lado dos combinados da sessão e do registro de humor.
// O consentimento é a primeira mensagem do próprio chat, sem tela separada.
@Component({
  selector: 'psi-proto-paciente-b',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, HlmButton, HlmInput, HlmLabel],
  providers: [provideIcons({ lucideCheck, lucideSend })],
  template: `
    <div class="mx-auto grid max-w-5xl gap-8 px-4 py-6 lg:grid-cols-[1fr_19rem]">
      <section aria-label="Conversa" class="flex min-h-[32rem] flex-col">
        <h1 class="text-2xl font-semibold">Oi, Camila</h1>
        <div class="mt-4 flex-1 space-y-4 rounded-(--radius-surface) border p-4" role="log" aria-live="polite">
          <div class="max-w-[85%]">
            <p class="bg-muted rounded-xl rounded-bl-sm px-4 py-3">
              Eu sou o companheiro do seu acompanhamento. Não sou terapeuta. {{ psicologa }} lê esta
              conversa e recebe um aviso se algo pedir atenção.
            </p>
            @if (!consentido()) {
              <button hlmBtn class="mt-3" (click)="aceitar.emit()">Entendi, podemos conversar</button>
            } @else {
              <p class="text-muted-foreground mt-1.5 flex items-center gap-1 text-sm">
                <ng-icon name="lucideCheck" aria-hidden="true" /> Você aceitou ler isso
              </p>
            }
          </div>

          @if (consentido()) {
            @for (m of mensagens(); track m.id) {
              @if (m.de === 'agente') {
                <div class="max-w-[85%]">
                  <p class="bg-muted rounded-xl rounded-bl-sm px-4 py-3">{{ m.texto }}</p>
                  @if (m.fixa) {
                    <p class="text-muted-foreground mt-1.5 text-sm">Resposta fixa. {{ psicologa }} foi avisada.</p>
                  }
                </div>
              } @else {
                <div class="ms-auto max-w-[85%]">
                  <p class="bg-primary text-primary-foreground rounded-xl rounded-br-sm px-4 py-3">{{ m.texto }}</p>
                </div>
              }
            }
          }
        </div>

        @if (consentido()) {
          @if (usadas() >= limite()) {
            <p class="bg-muted mt-4 rounded-md px-4 py-3">
              Limite de hoje atingido. Amanhã a conversa continua e {{ psicologa }} segue vendo tudo.
            </p>
          } @else {
            <form class="mt-4 flex items-end gap-2" (submit)="enviarTexto($event)">
              <div class="grid flex-1 gap-1.5">
                <label hlmLabel for="msg-b">Sua mensagem</label>
                <input hlmInput id="msg-b" type="text" autocomplete="off" [value]="texto()" (input)="texto.set($any($event.target).value)" />
              </div>
              <button hlmBtn type="submit"><ng-icon name="lucideSend" aria-hidden="true" />Enviar</button>
            </form>
            <p class="text-muted-foreground mt-2 text-sm tabular-nums">{{ usadas() }} de {{ limite() }} mensagens hoje</p>
          }
        }
      </section>

      <aside class="space-y-8 lg:pt-12" aria-label="Combinados e humor">
        <div>
          <h2 class="text-lg font-semibold">Combinado com {{ psicologa }}</h2>
          <ul class="mt-3 space-y-3">
            @for (t of tarefas(); track t.id) {
              <li class="flex items-start gap-3">
                <input
                  type="checkbox"
                  class="mt-1 size-5"
                  [id]="'t' + t.id"
                  [checked]="feitas().has(t.id) || t.feitaHoje"
                  (change)="alternar(t.id)"
                />
                <label [for]="'t' + t.id" class="leading-snug">
                  {{ t.texto }}
                  <span class="text-muted-foreground block text-sm">{{ t.frequencia }}</span>
                </label>
              </li>
            }
          </ul>
        </div>

        <div>
          <h2 class="text-lg font-semibold">Como você está agora?</h2>
          <div class="mt-3 grid grid-cols-5 gap-1.5" role="group" aria-label="Humor de 1 a 5">
            @for (n of [1, 2, 3, 4, 5]; track n) {
              <button
                hlmBtn
                variant="outline"
                size="sm"
                class="px-0"
                [class.bg-secondary!]="humor() === n"
                [attr.aria-pressed]="humor() === n"
                (click)="registrarHumor.emit(n)"
              >{{ n }}</button>
            }
          </div>
          <p class="text-muted-foreground mt-2 flex justify-between text-sm"><span>Muito mal</span><span>Muito bem</span></p>
          @if (humor()) {
            <p class="mt-2 text-sm">Anotei {{ humor() }} para a {{ psicologa }}.</p>
          }
        </div>
      </aside>
    </div>
  `,
})
export class PacienteB {
  readonly mensagens = input.required<Msg[]>();
  readonly consentido = input.required<boolean>();
  readonly usadas = input.required<number>();
  readonly limite = input.required<number>();
  readonly tarefas = input.required<Tarefa[]>();
  readonly humor = input.required<number | null>();
  readonly enviar = output<string>();
  readonly aceitar = output<void>();
  readonly registrarHumor = output<number>();

  protected readonly psicologa = PSICOLOGA;
  protected readonly texto = signal('');
  protected readonly feitas = signal(new Set<number>());

  protected alternar(id: number): void {
    this.feitas.update((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  protected enviarTexto(e: Event): void {
    e.preventDefault();
    const t = this.texto().trim();
    if (!t) return;
    this.enviar.emit(t);
    this.texto.set('');
  }
}
