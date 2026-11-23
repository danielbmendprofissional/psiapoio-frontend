import { Component, inject, signal } from '@angular/core';
import { ApiService, lerErro } from '../../core/api.service';
import { TarefaDia } from '../../core/models';
import { Combinados } from './combinados.component';

@Component({
  selector: 'psi-combinados-page',
  imports: [Combinados],
  template: `
    <div class="mx-auto max-w-2xl px-4 py-8">
      <h1 class="text-3xl font-semibold">Meus combinados</h1>
      <p class="text-muted-foreground mt-2">Marque o que você fez hoje. Uma marcação por dia.</p>
      <div class="mt-6">
        @if (erro()) {
          <p role="alert" class="text-destructive font-semibold">{{ erro() }}</p>
        } @else {
          <psi-combinados [tarefas]="tarefas()" (mudou)="atualizar($event)" />
        }
      </div>
    </div>
  `,
})
export class CombinadosPage {
  private readonly api = inject(ApiService);
  protected readonly tarefas = signal<TarefaDia[]>([]);
  protected readonly erro = signal('');

  constructor() {
    void this.carregar();
  }

  private async carregar(): Promise<void> {
    try {
      this.tarefas.set((await this.api.meuAcompanhamento()).tarefas);
    } catch (e) {
      this.erro.set(lerErro(e).mensagem);
    }
  }

  protected atualizar(m: { id: string; feita: boolean }): void {
    this.tarefas.update((l) => l.map((t) => (t.id === m.id ? { ...t, feitaHoje: m.feita } : t)));
  }
}
