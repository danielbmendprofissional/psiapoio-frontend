import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, input, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleHelp, lucideOctagonAlert, lucidePlus, lucideTrash2, lucideTriangleAlert } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { ApiService, lerErro } from '../../core/api.service';
import {
  ABORDAGENS,
  Alerta,
  GatilhoForm,
  MsgPsicologo,
  Nivel,
  PacienteDetalhe,
  Pauta,
  ROTULO_ABORDAGEM,
  ROTULO_FREQUENCIA,
  Resumo,
  TarefaForm,
} from '../../core/models';
import { NivelBadge, PerfilStatusBadge } from '../../shared/status.components';

type Aba = 'conversa' | 'acompanhamento' | 'resumo';

@Component({
  selector: 'psi-paciente-detalhe',
  imports: [DatePipe, NgIcon, HlmButton, HlmInput, HlmLabel, NivelBadge, PerfilStatusBadge],
  providers: [provideIcons({ lucideCircleHelp, lucideOctagonAlert, lucidePlus, lucideTrash2, lucideTriangleAlert })],
  template: `
    <div class="px-5 py-6 lg:px-10">
      @if (!p()) {
        @if (erro()) { <p role="alert" class="text-destructive font-semibold">{{ erro() }}</p> }
        @else { <p class="text-muted-foreground">Carregando…</p> }
      } @else {
        @let pac = p()!;
        <header class="flex flex-wrap items-center gap-3">
          <h1 class="text-3xl font-semibold">{{ pac.nome }}</h1>
          <psi-nivel [nivel]="nivelAtual()" />
          <psi-perfil-status [status]="pac.perfilStatus" />
          <span class="ms-auto flex flex-wrap gap-2">
            @if (pac.status === 'convidado') {
              <button hlmBtn variant="outline" size="sm" (click)="reenviar()">Reenviar convite</button>
            }
            @if (confirmandoRemocao()) {
              <button hlmBtn variant="destructive" size="sm" (click)="remover()">Confirmar remoção</button>
              <button hlmBtn variant="ghost" size="sm" (click)="confirmandoRemocao.set(false)">Cancelar</button>
            } @else {
              <button hlmBtn variant="ghost" size="sm" (click)="confirmandoRemocao.set(true)"><ng-icon name="lucideTrash2" aria-hidden="true" />Remover paciente</button>
            }
          </span>
        </header>
        <p class="text-muted-foreground mt-1">{{ pac.email }}
          @if (pac.status === 'convidado') { · aguardando a criação da senha }
          @else if (!pac.consentimentoEm) { · ainda não deu o Consentimento }
        </p>
        @if (aviso()) { <p role="status" class="bg-secondary text-secondary-foreground mt-4 rounded-md px-4 py-3">{{ aviso() }}</p> }
        @if (erro()) { <p role="alert" class="text-destructive mt-4 font-semibold">{{ erro() }}</p> }

        <div role="tablist" aria-label="Seções do paciente" class="mt-6 flex gap-1 border-b">
          @for (a of abas; track a.id) {
            <button
              role="tab"
              type="button"
              [id]="'aba-' + a.id"
              [attr.aria-selected]="aba() === a.id"
              [attr.aria-controls]="'painel-' + a.id"
              class="-mb-px border-b-2 px-4 py-2.5 font-semibold"
              [class.border-primary]="aba() === a.id"
              [class.text-primary]="aba() === a.id"
              [class.border-transparent]="aba() !== a.id"
              (click)="aba.set(a.id)"
            >{{ a.rotulo }}</button>
          }
        </div>

        <!-- CONVERSA -->
        @if (aba() === 'conversa') {
          <section id="painel-conversa" role="tabpanel" aria-labelledby="aba-conversa" class="mt-6 grid gap-x-10 gap-y-8 xl:grid-cols-[1fr_22rem]">
            <div>
              <h2 class="text-xl font-semibold">Conversa</h2>
              @if (conversa().length === 0) {
                <p class="text-muted-foreground mt-3 max-w-prose text-lg">
                  Ainda não há conversa. O agente só liga depois que você aprovar o Perfil do agente e o paciente der o Consentimento.
                </p>
              } @else {
                <ol class="mt-3 divide-y">
                  @for (m of conversa(); track m.id) {
                    <li class="grid grid-cols-[4.5rem_1fr] gap-3 py-2.5"
                      [class.bg-status-risco-linha]="m.risco === 'risco'"
                      [class.bg-status-atencao-bg]="m.risco === 'atencao'">
                      <span class="text-muted-foreground text-sm tabular-nums">{{ m.criadaEm | date: 'dd/MM HH:mm' }}</span>
                      <div>
                        <p class="flex flex-wrap items-center gap-2">
                          <span class="font-semibold">{{ m.papel === 'agente' ? 'Agente' : 'Paciente' }}</span>
                          @if (m.fixa) { <span class="text-muted-foreground text-sm">· resposta fixa</span> }
                          @if (m.foraDoEscopo) { <span class="text-muted-foreground text-sm">· fora do escopo{{ m.temaPauta ? ': ' + m.temaPauta : '' }}</span> }
                          @if (m.risco === 'risco' || m.risco === 'atencao') { <psi-nivel [nivel]="m.risco!" /> }
                          @if (m.naoClassificada) {
                            <span class="text-status-pendente-fg inline-flex items-center gap-1 text-sm font-semibold"><ng-icon name="lucideCircleHelp" aria-hidden="true" />Não classificada</span>
                          }
                        </p>
                        <p class="whitespace-pre-wrap">{{ m.texto }}</p>
                        @if (m.risco && m.risco !== 'nenhum' && m.motivoRisco) { <p class="text-muted-foreground mt-1 text-sm">Motivo: {{ m.motivoRisco }}</p> }
                      </div>
                    </li>
                  }
                </ol>
              }
            </div>
            <aside aria-label="Alertas" class="space-y-3">
              <h2 class="text-xl font-semibold">Alertas</h2>
              @if (alertas().length === 0) {
                <p class="text-muted-foreground">Nenhum alerta até agora.</p>
              } @else {
                <ul class="space-y-3">
                  @for (a of alertas(); track a.id) {
                    <li class="rounded-md border p-3" [class.bg-status-risco-linha]="a.nivel === 'risco' && !a.lido">
                      <p class="flex flex-wrap items-center gap-2"><psi-nivel [nivel]="a.nivel" />
                        <span class="text-muted-foreground text-sm tabular-nums">{{ a.criadoEm | date: 'dd/MM HH:mm' }}{{ a.lido ? ' · lido' : '' }}</span></p>
                      <p class="mt-2">{{ a.texto }}</p>
                    </li>
                  }
                </ul>
                @if (naoLidos() > 0) {
                  <button hlmBtn variant="outline" (click)="marcarLidos()">Marcar {{ naoLidos() }} como lido(s)</button>
                }
              }
            </aside>
          </section>
        }

        <!-- ACOMPANHAMENTO -->
        @if (aba() === 'acompanhamento') {
          <section id="painel-acompanhamento" role="tabpanel" aria-labelledby="aba-acompanhamento" class="mt-6 grid gap-x-10 gap-y-8 xl:grid-cols-[1fr_24rem]">
            <form class="space-y-6" (submit)="salvar($event)">
              <h2 class="text-xl font-semibold">Formulário clínico</h2>
              <div class="grid gap-1.5 sm:max-w-xs">
                <label hlmLabel for="abordagem">Abordagem</label>
                <select id="abordagem" class="bg-card border-input h-11 rounded-md border px-3" required [value]="abordagem()" (change)="abordagem.set(valor($event))">
                  <option value="">Escolha…</option>
                  @for (a of abordagens; track a) { <option [value]="a" [selected]="abordagem() === a">{{ rotuloAbordagem[a] }}</option> }
                </select>
              </div>
              <div class="grid gap-1.5">
                <label hlmLabel for="obs">Orientações ao agente (até 600 caracteres)</label>
                <textarea id="obs" rows="3" maxlength="600" class="bg-card border-input rounded-md border px-3 py-2" [value]="observacoes()" (input)="observacoes.set(valor($event))"></textarea>
              </div>

              <fieldset class="space-y-2">
                <legend class="font-semibold">Temas-foco</legend>
                @for (t of temas(); track $index) {
                  <div class="flex gap-2">
                    <input hlmInput [attr.aria-label]="'Tema ' + ($index + 1)" maxlength="80" [value]="t" (input)="setTema($index, valor($event))" />
                    <button hlmBtn type="button" variant="ghost" size="icon" [attr.aria-label]="'Remover tema ' + ($index + 1)" (click)="removerTema($index)"><ng-icon name="lucideTrash2" aria-hidden="true" /></button>
                  </div>
                }
                <button hlmBtn type="button" variant="outline" size="sm" [disabled]="temas().length >= 8" (click)="temas.update(l => [...l, ''])"><ng-icon name="lucidePlus" aria-hidden="true" />Adicionar tema</button>
              </fieldset>

              <fieldset class="space-y-2">
                <legend class="font-semibold">Tarefas</legend>
                @for (t of tarefas(); track $index) {
                  <div class="flex flex-wrap gap-2">
                    <input hlmInput class="min-w-48 flex-1" [attr.aria-label]="'Descrição da tarefa ' + ($index + 1)" maxlength="200" [value]="t.descricao" (input)="setTarefa($index, { descricao: valor($event) })" />
                    <select class="bg-card border-input h-11 rounded-md border px-3" [attr.aria-label]="'Frequência da tarefa ' + ($index + 1)" (change)="setTarefa($index, { frequencia: valor($event) })">
                      @for (f of frequencias; track f) { <option [value]="f" [selected]="t.frequencia === f">{{ rotuloFrequencia[f] }}</option> }
                    </select>
                    <button hlmBtn type="button" variant="ghost" size="icon" [attr.aria-label]="'Remover tarefa ' + ($index + 1)" (click)="tarefas.update(l => l.filter((_, i) => i !== $index))"><ng-icon name="lucideTrash2" aria-hidden="true" /></button>
                  </div>
                }
                <button hlmBtn type="button" variant="outline" size="sm" [disabled]="tarefas().length >= 10" (click)="tarefas.update(l => [...l, { descricao: '', frequencia: 'diaria' }])"><ng-icon name="lucidePlus" aria-hidden="true" />Adicionar tarefa</button>
              </fieldset>

              <fieldset class="space-y-2">
                <legend class="font-semibold">Gatilhos</legend>
                <p class="text-muted-foreground text-sm">Expressões ou temas que merecem atenção ou risco para este paciente.</p>
                @for (g of gatilhos(); track $index) {
                  <div class="flex flex-wrap gap-2">
                    <input hlmInput class="min-w-48 flex-1" [attr.aria-label]="'Texto do gatilho ' + ($index + 1)" maxlength="80" [value]="g.texto" (input)="setGatilho($index, { texto: valor($event) })" />
                    <select class="bg-card border-input h-11 rounded-md border px-3" [attr.aria-label]="'Nível do gatilho ' + ($index + 1)" (change)="setGatilho($index, { nivel: valor($event) })">
                      <option value="atencao" [selected]="g.nivel === 'atencao'">Atenção</option>
                      <option value="risco" [selected]="g.nivel === 'risco'">Risco</option>
                    </select>
                    <button hlmBtn type="button" variant="ghost" size="icon" [attr.aria-label]="'Remover gatilho ' + ($index + 1)" (click)="gatilhos.update(l => l.filter((_, i) => i !== $index))"><ng-icon name="lucideTrash2" aria-hidden="true" /></button>
                  </div>
                }
                <button hlmBtn type="button" variant="outline" size="sm" [disabled]="gatilhos().length >= 15" (click)="gatilhos.update(l => [...l, { texto: '', nivel: 'atencao' }])"><ng-icon name="lucideTriangleAlert" aria-hidden="true" />Adicionar gatilho</button>
              </fieldset>

              <button hlmBtn type="submit" [disabled]="salvando()">{{ salvando() ? 'Salvando…' : 'Salvar formulário clínico' }}</button>
            </form>

            <aside class="space-y-4" aria-label="Perfil do agente">
              <h2 class="text-xl font-semibold">Perfil do agente</h2>
              <psi-perfil-status [status]="pac.perfilStatus" />
              @if (pac.perfilStatus === 'reprovado' && pac.perfilMotivoReprovacao) {
                <p class="text-muted-foreground">Motivo da reprovação: {{ pac.perfilMotivoReprovacao }}</p>
              }
              @if (pac.pessoal; as ps) {
                <dl class="space-y-2">
                  <div><dt class="text-muted-foreground text-sm">Prefere ser chamado de</dt><dd>{{ ps.comoPrefereSerChamado }}</dd></div>
                  @if (ps.rotina) { <div><dt class="text-muted-foreground text-sm">Rotina</dt><dd>{{ ps.rotina }}</dd></div> }
                  @if (ps.oQueAjuda) { <div><dt class="text-muted-foreground text-sm">O que ajuda</dt><dd>{{ ps.oQueAjuda }}</dd></div> }
                  @if (ps.evitar) { <div><dt class="text-muted-foreground text-sm">Prefere evitar</dt><dd>{{ ps.evitar }}</dd></div> }
                  <div><dt class="text-muted-foreground text-sm">Tom</dt><dd>{{ ps.tom === 'direto' ? 'Mais direto' : 'Mais acolhedor' }}</dd></div>
                </dl>
              } @else {
                <p class="text-muted-foreground">O paciente ainda não preencheu o formulário pessoal.</p>
              }
              @if (!pac.abordagem) { <p class="text-muted-foreground">Falta salvar o formulário clínico.</p> }
              @if (pac.perfilStatus === 'pendente') {
                <button hlmBtn class="w-full" (click)="aprovar()">Aprovar Perfil do agente</button>
                <div class="grid gap-1.5">
                  <label hlmLabel for="motivo">Motivo (opcional)</label>
                  <input hlmInput id="motivo" maxlength="300" [value]="motivo()" (input)="motivo.set(valor($event))" />
                </div>
                <button hlmBtn variant="outline" class="w-full" (click)="reprovar()">Reprovar</button>
              } @else if (pac.perfilStatus === 'aprovado') {
                <button hlmBtn variant="outline" class="w-full" (click)="reprovar()">Reprovar e desligar o agente</button>
              }
            </aside>
          </section>
        }

        <!-- RESUMO E PAUTA -->
        @if (aba() === 'resumo') {
          <section id="painel-resumo" role="tabpanel" aria-labelledby="aba-resumo" class="mt-6 grid gap-x-10 gap-y-8 lg:grid-cols-2">
            <div class="space-y-4">
              <h2 class="text-xl font-semibold">Resumo diário</h2>
              <p class="text-muted-foreground">Anotação sobre o dia, não conclusão clínica. Gerada sob demanda.</p>
              <div class="flex flex-wrap items-end gap-3">
                <div class="grid gap-1.5">
                  <label hlmLabel for="dia">Dia (vazio = ontem)</label>
                  <input hlmInput id="dia" type="date" class="w-auto" [value]="dia()" (input)="dia.set(valor($event))" />
                </div>
                <button hlmBtn [disabled]="gerando()" (click)="gerarResumo()">{{ gerando() === 'resumo' ? 'Gerando…' : 'Gerar resumo' }}</button>
              </div>
              @for (r of resumos(); track r.id) {
                <article class="rounded-md border p-4">
                  <h3 class="font-semibold">{{ r.dia | date: 'dd/MM/yyyy' }}</h3>
                  <p class="mt-1 whitespace-pre-wrap">{{ r.texto }}</p>
                  <p class="text-muted-foreground mt-2 text-sm">Gerado em {{ r.geradoEm | date: 'dd/MM HH:mm' }}</p>
                </article>
              } @empty { <p class="text-muted-foreground">Nenhum resumo gerado ainda.</p> }
            </div>
            <div class="space-y-4">
              <h2 class="text-xl font-semibold">Pauta da próxima sessão</h2>
              <p class="text-muted-foreground">Montada a partir dos resumos e dos temas que o paciente quis levar.</p>
              <button hlmBtn [disabled]="gerando()" (click)="gerarPauta()">{{ gerando() === 'pauta' ? 'Montando…' : 'Montar pauta' }}</button>
              @if (pauta(); as pt) {
                <article class="rounded-md border p-4">
                  <p>{{ pt.texto }}</p>
                  <ul class="mt-2 list-disc space-y-1.5 ps-5">@for (i of pt.itens; track i) { <li>{{ i }}</li> }</ul>
                  <p class="text-muted-foreground mt-2 text-sm">Gerada em {{ pt.geradoEm | date: 'dd/MM HH:mm' }}</p>
                </article>
              } @else { <p class="text-muted-foreground">Nenhuma pauta montada ainda.</p> }
            </div>
          </section>
        }
      }
    </div>
  `,
})
export class PacienteDetalhePage {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  readonly id = input.required<string>();

  protected readonly abas: { id: Aba; rotulo: string }[] = [
    { id: 'conversa', rotulo: 'Conversa e alertas' },
    { id: 'acompanhamento', rotulo: 'Acompanhamento' },
    { id: 'resumo', rotulo: 'Resumo e pauta' },
  ];
  protected readonly abordagens = ABORDAGENS;
  protected readonly rotuloAbordagem = ROTULO_ABORDAGEM;
  protected readonly rotuloFrequencia = ROTULO_FREQUENCIA;
  protected readonly frequencias = ['diaria', 'semanal', 'sob_demanda'] as const;

  protected readonly p = signal<PacienteDetalhe | null>(null);
  protected readonly aba = signal<Aba>('conversa');
  protected readonly erro = signal('');
  protected readonly aviso = signal('');
  protected readonly conversa = signal<MsgPsicologo[]>([]);
  protected readonly alertas = signal<Alerta[]>([]);
  protected readonly resumos = signal<Resumo[]>([]);
  protected readonly pauta = signal<Pauta | null>(null);
  protected readonly salvando = signal(false);
  protected readonly gerando = signal<'' | 'resumo' | 'pauta'>('');
  protected readonly confirmandoRemocao = signal(false);
  protected readonly motivo = signal('');
  protected readonly dia = signal('');

  protected readonly abordagem = signal('');
  protected readonly observacoes = signal('');
  protected readonly temas = signal<string[]>([]);
  protected readonly tarefas = signal<TarefaForm[]>([]);
  protected readonly gatilhos = signal<GatilhoForm[]>([]);

  protected readonly naoLidos = computed(() => this.alertas().filter((a) => !a.lido).length);
  protected readonly nivelAtual = computed<Nivel>(() => {
    const abertos = this.alertas().filter((a) => !a.lido);
    return abertos.some((a) => a.nivel === 'risco') ? 'risco' : abertos.length > 0 ? 'atencao' : 'nenhum';
  });

  constructor() {
    effect(() => {
      void this.carregar(this.id());
    });
    // A conversa do paciente é atualizada enquanto a aba está aberta (útil na demonstração).
    const t = setInterval(() => {
      if (this.aba() === 'conversa' && this.p()) void this.atualizarConversa();
    }, 10000);
    inject(DestroyRef).onDestroy(() => clearInterval(t));
  }

  protected valor(e: Event): string {
    return (e.target as HTMLInputElement).value;
  }

  private preencherForm(d: PacienteDetalhe): void {
    this.abordagem.set(d.abordagem ?? '');
    this.observacoes.set(d.observacoes ?? '');
    this.temas.set([...d.temas]);
    this.tarefas.set(d.tarefas.map((t) => ({ ...t })));
    this.gatilhos.set(d.gatilhos.map((g) => ({ ...g })));
  }

  private async carregar(id: string): Promise<void> {
    try {
      const d = await this.api.paciente(id);
      this.p.set(d);
      this.preencherForm(d);
      this.aba.set(d.perfilStatus === 'aprovado' ? 'conversa' : 'acompanhamento');
      await Promise.all([this.atualizarConversa(), this.carregarResumos()]);
    } catch (e) {
      this.erro.set(lerErro(e).mensagem);
    }
  }

  private async atualizarConversa(): Promise<void> {
    try {
      const [c, a] = await Promise.all([this.api.conversaDoPaciente(this.id()), this.api.alertas(this.id())]);
      this.conversa.set(c);
      this.alertas.set(a);
    } catch (e) {
      this.erro.set(lerErro(e).mensagem);
    }
  }

  private async carregarResumos(): Promise<void> {
    try {
      const [r, pt] = await Promise.all([this.api.resumos(this.id()), this.api.pauta(this.id())]);
      this.resumos.set(r);
      this.pauta.set(pt);
    } catch (e) {
      this.erro.set(lerErro(e).mensagem);
    }
  }

  private async acao(fn: () => Promise<unknown>, ok?: string): Promise<boolean> {
    this.erro.set('');
    this.aviso.set('');
    try {
      await fn();
      if (ok) this.aviso.set(ok);
      return true;
    } catch (e) {
      this.erro.set(lerErro(e).mensagem);
      return false;
    }
  }

  private async recarregarPaciente(): Promise<void> {
    const d = await this.api.paciente(this.id());
    this.p.set(d);
  }

  protected setTema(i: number, v: string): void {
    this.temas.update((l) => l.map((t, k) => (k === i ? v : t)));
  }
  protected removerTema(i: number): void {
    this.temas.update((l) => l.filter((_, k) => k !== i));
  }
  protected setTarefa(i: number, parcial: Partial<TarefaForm> | { frequencia: string }): void {
    this.tarefas.update((l) => l.map((t, k) => (k === i ? ({ ...t, ...parcial } as TarefaForm) : t)));
  }
  protected setGatilho(i: number, parcial: Partial<GatilhoForm> | { nivel: string }): void {
    this.gatilhos.update((l) => l.map((g, k) => (k === i ? ({ ...g, ...parcial } as GatilhoForm) : g)));
  }

  protected async salvar(e: Event): Promise<void> {
    e.preventDefault();
    this.salvando.set(true);
    const ok = await this.acao(async () => {
      const d = await this.api.salvarClinico(this.id(), {
        abordagem: this.abordagem() || null,
        observacoes: this.observacoes(),
        temas: this.temas(),
        tarefas: this.tarefas(),
        gatilhos: this.gatilhos(),
      });
      this.p.set(d);
      this.preencherForm(d);
    }, 'Formulário clínico salvo.');
    this.salvando.set(false);
    if (ok && this.p()?.perfilStatus === 'pendente') this.aviso.set('Formulário salvo. Agora aprove o Perfil do agente para ligar o agente.');
  }

  protected async aprovar(): Promise<void> {
    if (await this.acao(() => this.api.aprovarPerfil(this.id()), 'Perfil aprovado. O agente já pode conversar com o paciente.')) {
      await this.recarregarPaciente();
    }
  }

  protected async reprovar(): Promise<void> {
    if (await this.acao(() => this.api.reprovarPerfil(this.id(), this.motivo()), 'Perfil reprovado. O agente está desligado para este paciente.')) {
      this.motivo.set('');
      await this.recarregarPaciente();
    }
  }

  protected async marcarLidos(): Promise<void> {
    if (await this.acao(() => this.api.marcarAlertasLidos(this.id()))) await this.atualizarConversa();
  }

  protected async reenviar(): Promise<void> {
    await this.acao(async () => {
      const c = await this.api.reenviarConvite(this.id());
      this.aviso.set(c.emailEnviado ? 'Convite reenviado.' : `E-mail não enviado. Link do convite: ${c.linkConvite}`);
    });
  }

  protected async remover(): Promise<void> {
    if (await this.acao(() => this.api.removerPaciente(this.id()))) await this.router.navigate(['/pacientes']);
  }

  protected async gerarResumo(): Promise<void> {
    this.gerando.set('resumo');
    if (await this.acao(() => this.api.gerarResumo(this.id(), this.dia() || undefined))) await this.carregarResumos();
    this.gerando.set('');
  }

  protected async gerarPauta(): Promise<void> {
    this.gerando.set('pauta');
    if (await this.acao(async () => this.pauta.set(await this.api.gerarPauta(this.id())))) { /* ok */ }
    this.gerando.set('');
  }
}
