import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { HlmButton } from '@spartan-ng/helm/button';
import {
  GATILHOS_RISCO,
  LIMITE_DIARIO,
  MENSAGENS_BASE,
  Msg,
  RESPOSTA_FORA_ESCOPO,
  RESPOSTA_RISCO,
  TAREFAS_CAMILA,
} from '../prototype-data';
import { Shell } from '../../layout/shell.component';
import { PrototypeSwitcher } from '../prototype-switcher.component';
import { PacienteA } from './paciente-a.component';
import { PacienteB } from './paciente-b.component';
import { PacienteC } from './paciente-c.component';

type Cenario = 'consentimento' | 'conversa' | 'risco' | 'limite';

/**
 * PROTÓTIPO DESCARTÁVEL. Pergunta: como o paciente conversa com o agente (consentimento, chat,
 * resposta fixa de risco, limite diário)? Três variantes em /prototype/paciente?variant=A|B|C.
 * O estado mora aqui e o agente é um stub: digite "não aguento mais" para ver o caminho de risco.
 */
@Component({
  selector: 'psi-proto-paciente',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Shell, HlmButton, PrototypeSwitcher, PacienteA, PacienteB, PacienteC],
  template: `
    <psi-shell [usuario]="usuario" [itens]="itens">
    <div class="border-b border-dashed bg-muted/60">
      <div class="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-4 py-2 text-sm">
        <span class="text-muted-foreground me-1">Cenário do protótipo:</span>
        @for (c of cenarios; track c.id) {
          <button hlmBtn size="sm" [variant]="cenario() === c.id ? 'default' : 'outline'" (click)="aplicar(c.id)">
            {{ c.nome }}
          </button>
        }
        <span class="text-muted-foreground ms-auto">Dica: digite “não aguento mais” no chat.</span>
      </div>
    </div>

    @switch (variant()) {
      @case ('B') {
        <psi-proto-paciente-b [mensagens]="mensagens()" [consentido]="consentido()" [usadas]="usadas()" [limite]="limite" [tarefas]="tarefas" [humor]="humor()" (enviar)="enviar($event)" (aceitar)="consentido.set(true)" (registrarHumor)="humor.set($event)" />
      }
      @case ('C') {
        <psi-proto-paciente-c [mensagens]="mensagens()" [consentido]="consentido()" [usadas]="usadas()" [limite]="limite" [humor]="humor()" (enviar)="enviar($event)" (aceitar)="consentido.set(true)" (registrarHumor)="humor.set($event)" />
      }
      @default {
        <psi-proto-paciente-a [mensagens]="mensagens()" [consentido]="consentido()" [usadas]="usadas()" [limite]="limite" (enviar)="enviar($event)" (aceitar)="consentido.set(true)" />
      }
    }
    </psi-shell>

    <psi-proto-switcher [variants]="variantes" [nomes]="nomes" [current]="variant()" />
  `,
})
export class PacientePrototypePage {
  private readonly route = inject(ActivatedRoute);

  protected readonly usuario = { nome: 'Camila Duarte', papel: 'Paciente' };
  protected readonly itens = [
    { rotulo: 'Conversa', icone: 'lucideMessageCircle' },
    { rotulo: 'Meus combinados', icone: 'lucideListChecks' },
    { rotulo: 'Meu perfil', icone: 'lucideUser' },
  ];
  protected readonly variantes = ['A', 'B', 'C'];
  protected readonly nomes: Record<string, string> = {
    A: 'Conversa simples',
    B: 'Chat + combinados',
    C: 'Uma coisa por vez',
  };
  protected readonly variant = toSignal(
    this.route.queryParamMap.pipe(map((p) => p.get('variant') ?? 'A')),
    { initialValue: 'A' },
  );

  protected readonly cenarios: { id: Cenario; nome: string }[] = [
    { id: 'consentimento', nome: 'Primeiro acesso' },
    { id: 'conversa', nome: 'Conversa' },
    { id: 'risco', nome: 'Mensagem de risco' },
    { id: 'limite', nome: 'Limite do dia' },
  ];

  protected readonly limite = LIMITE_DIARIO;
  protected readonly tarefas = TAREFAS_CAMILA;

  protected readonly cenario = signal<Cenario>('conversa');
  protected readonly consentido = signal(true);
  protected readonly mensagens = signal<Msg[]>(MENSAGENS_BASE);
  protected readonly usadas = signal(14);
  protected readonly humor = signal<number | null>(null);
  private nextId = 100;

  protected readonly limiteAtingido = computed(() => this.usadas() >= this.limite);

  protected aplicar(c: Cenario): void {
    this.cenario.set(c);
    this.humor.set(null);
    this.consentido.set(c !== 'consentimento');
    this.usadas.set(c === 'limite' ? this.limite : 14);
    this.mensagens.set(MENSAGENS_BASE);
    if (c === 'risco') {
      this.enviar('Hoje não aguento mais nada disso.');
    }
  }

  protected enviar(texto: string): void {
    if (this.limiteAtingido()) return;
    const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const risco = GATILHOS_RISCO.test(texto);
    this.usadas.update((n) => n + 1);
    this.mensagens.update((m) => [
      ...m,
      { id: this.nextId++, de: 'paciente', hora, texto, nivel: risco ? 'risco' : 'nenhum' },
    ]);
    setTimeout(() => {
      this.mensagens.update((m) => [
        ...m,
        {
          id: this.nextId++,
          de: 'agente',
          hora,
          texto: risco ? RESPOSTA_RISCO : texto.length > 60 ? RESPOSTA_FORA_ESCOPO : 'Entendi. Obrigada por me contar. Quer registrar isso no seu humor de hoje?',
          fixa: risco,
        },
      ]);
    }, 600);
  }
}
