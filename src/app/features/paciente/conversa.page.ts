import { Component, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSend } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { ApiService, lerErro } from '../../core/api.service';
import { MeuAcompanhamento, MsgPaciente, TarefaDia } from '../../core/models';
import { Combinados } from './combinados.component';

@Component({
  selector: 'psi-conversa',
  imports: [NgIcon, HlmButton, HlmInput, HlmLabel, Combinados],
  providers: [provideIcons({ lucideSend })],
  template: `
    @if (carregando()) {
      <p class="text-muted-foreground px-4 py-8">Carregando…</p>
    } @else if (acompanhamento(); as ac) {
      @if (ac.perfilStatus !== 'aprovado') {
        <div class="mx-auto max-w-2xl px-4 py-8">
          <h1 class="text-3xl font-semibold">Quase lá</h1>
          <p class="mt-4 max-w-prose text-lg" role="status">
            @if (ac.perfilStatus === 'reprovado') {
              Seu psicólogo está ajustando seu acompanhamento. Em breve você poderá conversar.
            } @else {
              Seu psicólogo ainda está revisando o seu acompanhamento. Assim que ele aprovar, a conversa começa por aqui.
            }
          </p>
        </div>
      } @else {
        <div class="mx-auto grid max-w-5xl gap-8 px-4 py-6 lg:grid-cols-[1fr_19rem]">
          <section aria-label="Conversa" class="flex min-h-[32rem] flex-col">
            <h1 class="text-2xl font-semibold">Conversa</h1>
            <div #registro class="mt-4 max-h-[60dvh] min-h-64 flex-1 space-y-4 overflow-y-auto rounded-(--radius-surface) border p-4" role="log" aria-live="polite" tabindex="0" aria-label="Mensagens">
              <div class="max-w-[85%]">
                <p class="bg-muted rounded-xl rounded-bl-sm px-4 py-3">{{ saudacao() }}</p>
              </div>
              @for (m of mensagens(); track m.id) {
                @if (m.papel === 'agente') {
                  <div class="max-w-[85%]"><p class="bg-muted rounded-xl rounded-bl-sm px-4 py-3">{{ m.texto }}</p></div>
                } @else {
                  <div class="ms-auto max-w-[85%]"><p class="bg-primary text-primary-foreground rounded-xl rounded-br-sm px-4 py-3">{{ m.texto }}</p></div>
                }
              }
              @if (enviando()) {
                <p class="text-muted-foreground" role="status">Escrevendo…</p>
              }
            </div>

            @if (erro()) { <p role="alert" class="text-destructive mt-3 font-semibold">{{ erro() }}</p> }

            @if (restantes() <= 0) {
              <p class="bg-muted mt-4 rounded-md px-4 py-3" role="status">Você chegou ao limite de hoje. Amanhã a gente continua. O seu psicólogo segue vendo tudo.</p>
            } @else {
              <form class="mt-4 flex items-end gap-2" (submit)="enviarTexto($event)">
                <div class="grid flex-1 gap-1.5">
                  <label hlmLabel for="msg">Sua mensagem</label>
                  <input hlmInput id="msg" type="text" autocomplete="off" maxlength="2000" [value]="texto()" [disabled]="enviando()" (input)="texto.set(valor($event))" />
                </div>
                <button hlmBtn type="submit" [disabled]="enviando() || !texto().trim()"><ng-icon name="lucideSend" aria-hidden="true" />Enviar</button>
              </form>
              <p class="text-muted-foreground mt-2 text-sm tabular-nums">{{ limite() - restantes() }} de {{ limite() }} mensagens hoje</p>
            }
          </section>

          <aside class="space-y-8 lg:pt-12" aria-label="Combinados e humor">
            <div>
              <h2 class="text-lg font-semibold">Meus combinados</h2>
              <div class="mt-3"><psi-combinados [tarefas]="tarefas()" (mudou)="atualizarTarefa($event)" /></div>
            </div>
            <div>
              <h2 class="text-lg font-semibold">Como você está agora?</h2>
              <div class="mt-3 grid grid-cols-5 gap-1.5" role="group" aria-label="Humor de 1 a 5">
                @for (n of notas; track n) {
                  <button hlmBtn variant="outline" size="sm" class="px-0" [disabled]="enviando() || restantes() <= 0" (click)="enviar('Meu humor agora é ' + n + ' de 5.')">{{ n }}</button>
                }
              </div>
              <p class="text-muted-foreground mt-2 flex justify-between text-sm"><span>Muito mal</span><span>Muito bem</span></p>
            </div>
          </aside>
        </div>
      }
    } @else if (erro()) {
      <p role="alert" class="text-destructive px-4 py-8 font-semibold">{{ erro() }}</p>
    }
  `,
})
export class ConversaPage {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly registro = viewChild<ElementRef<HTMLElement>>('registro');

  protected readonly notas = [1, 2, 3, 4, 5];
  protected readonly carregando = signal(true);
  protected readonly acompanhamento = signal<MeuAcompanhamento | null>(null);
  protected readonly tarefas = signal<TarefaDia[]>([]);
  protected readonly mensagens = signal<MsgPaciente[]>([]);
  protected readonly saudacao = signal('');
  protected readonly restantes = signal(0);
  protected readonly limite = signal(20);
  protected readonly texto = signal('');
  protected readonly enviando = signal(false);
  protected readonly erro = signal('');

  constructor() {
    afterNextRender(() => void this.carregar());
  }

  protected valor(e: Event): string {
    return (e.target as HTMLInputElement).value;
  }

  private async carregar(): Promise<void> {
    try {
      const ac = await this.api.meuAcompanhamento();
      // Consentimento e formulário pessoal vêm antes da primeira mensagem.
      if (ac.consentimentoEm === null || !ac.pessoalPreenchido) {
        await this.router.navigate(['/primeiros-passos']);
        return;
      }
      this.acompanhamento.set(ac);
      this.tarefas.set(ac.tarefas);
      if (ac.perfilStatus === 'aprovado') {
        const c = await this.api.minhaConversa();
        this.saudacao.set(c.saudacao);
        this.mensagens.set(c.mensagens);
        this.restantes.set(c.restantes);
        this.limite.set(c.limite);
      }
    } catch (e) {
      this.erro.set(lerErro(e).mensagem);
    } finally {
      this.carregando.set(false);
      this.rolar();
    }
  }

  protected atualizarTarefa(m: { id: string; feita: boolean }): void {
    this.tarefas.update((l) => l.map((t) => (t.id === m.id ? { ...t, feitaHoje: m.feita } : t)));
  }

  protected enviarTexto(e: Event): void {
    e.preventDefault();
    void this.enviar(this.texto());
  }

  protected async enviar(bruto: string): Promise<void> {
    const texto = bruto.trim();
    if (!texto || this.enviando()) return;
    this.erro.set('');
    this.enviando.set(true);
    const provisoria: MsgPaciente = { id: 'novo', papel: 'paciente', texto, criadaEm: '' };
    this.mensagens.update((l) => [...l, provisoria]);
    this.texto.set('');
    this.rolar();
    try {
      const r = await this.api.enviarMensagem(texto);
      this.mensagens.update((l) => [...l.filter((m) => m.id !== 'novo'), r.mensagemPaciente, r.mensagemAgente]);
      this.restantes.set(r.restantes);
    } catch (e) {
      const erro = lerErro(e);
      this.mensagens.update((l) => l.filter((m) => m.id !== 'novo'));
      this.texto.set(texto); // o rascunho não se perde
      if (erro.codigo === 'limite_diario') this.restantes.set(0);
      else if (erro.codigo === 'perfil_nao_aprovado' || erro.codigo === 'sem_consentimento') await this.carregar();
      else this.erro.set(erro.mensagem);
    } finally {
      this.enviando.set(false);
      this.rolar();
    }
  }

  private rolar(): void {
    queueMicrotask(() => {
      const el = this.registro()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }
}
