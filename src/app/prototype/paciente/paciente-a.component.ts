import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLock, lucideSend } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { Msg, PSICOLOGA } from '../prototype-data';

// PROTÓTIPO DESCARTÁVEL. Variante A: uma coluna, consentimento como tela própria, chat clássico.
@Component({
  selector: 'psi-proto-paciente-a',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, HlmButton, HlmInput, HlmLabel],
  providers: [provideIcons({ lucideLock, lucideSend })],
  template: `
    <div class="mx-auto flex min-h-[calc(100dvh-3rem)] max-w-xl flex-col px-4">
      <header class="border-b py-5">
        <h1 class="text-2xl font-semibold">Seu acompanhamento</h1>
        <p class="text-muted-foreground mt-1 flex items-center gap-1.5 text-[0.9375rem]">
          <ng-icon name="lucideLock" aria-hidden="true" />
          {{ psicologa }} lê esta conversa.
        </p>
      </header>

      @if (!consentido()) {
        <section class="flex flex-1 flex-col justify-center gap-6 py-10">
          <h2 class="text-3xl font-semibold">Antes de começar</h2>
          <ul class="space-y-3 text-lg">
            <li>Este é um companheiro de acompanhamento, não um terapeuta.</li>
            <li>Ele lembra das suas tarefas, tira dúvidas sobre os exercícios e anota seu humor.</li>
            <li><strong>{{ psicologa }} lê toda a conversa</strong> e recebe um aviso quando algo pede atenção.</li>
          </ul>
          <div class="flex items-start gap-3">
            <input id="aceite" type="checkbox" class="mt-1.5 size-5" [checked]="aceito()" (change)="aceito.set(!aceito())" />
            <label hlmLabel for="aceite" class="text-base leading-snug">
              Li e entendi que minha conversa é lida pela minha psicóloga.
            </label>
          </div>
          <button hlmBtn size="lg" class="self-start" [disabled]="!aceito()" (click)="aceitar.emit()">
            Começar a conversar
          </button>
        </section>
      } @else {
        <div class="flex-1 space-y-4 py-6" role="log" aria-label="Conversa" aria-live="polite">
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
        </div>

        <div class="bg-background sticky bottom-0 border-t py-4">
          @if (usadas() >= limite()) {
            <p class="bg-muted rounded-md px-4 py-3">
              Você chegou ao limite de mensagens de hoje. Amanhã a conversa continua; {{ psicologa }}
              segue vendo tudo.
            </p>
          } @else {
            <form class="flex items-end gap-2" (submit)="enviarTexto($event)">
              <div class="grid flex-1 gap-1.5">
                <label hlmLabel for="msg-a">Sua mensagem</label>
                <input hlmInput id="msg-a" type="text" autocomplete="off" [value]="texto()" (input)="texto.set($any($event.target).value)" />
              </div>
              <button hlmBtn type="submit"><ng-icon name="lucideSend" aria-hidden="true" />Enviar</button>
            </form>
            <p class="text-muted-foreground mt-2 text-sm tabular-nums">{{ usadas() }} de {{ limite() }} mensagens hoje</p>
          }
        </div>
      }
    </div>
  `,
})
export class PacienteA {
  readonly mensagens = input.required<Msg[]>();
  readonly consentido = input.required<boolean>();
  readonly usadas = input.required<number>();
  readonly limite = input.required<number>();
  readonly enviar = output<string>();
  readonly aceitar = output<void>();

  protected readonly psicologa = PSICOLOGA;
  protected readonly texto = signal('');
  protected readonly aceito = signal(false);

  protected enviarTexto(e: Event): void {
    e.preventDefault();
    const t = this.texto().trim();
    if (!t) return;
    this.enviar.emit(t);
    this.texto.set('');
  }
}
