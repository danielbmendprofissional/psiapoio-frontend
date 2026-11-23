import { Component, inject, input, output, signal } from '@angular/core';
import { ApiService, lerErro } from '../../core/api.service';
import { ROTULO_FREQUENCIA, TarefaDia } from '../../core/models';

/** Lista de Tarefas do dia: o próprio Paciente marca como feita, uma vez por dia (ADR 0006). */
@Component({
  selector: 'psi-combinados',
  template: `
    @if (tarefas().length === 0) {
      <p class="text-muted-foreground">Ainda não há combinados. Seu psicólogo vai incluir.</p>
    } @else {
      <ul class="space-y-3">
        @for (t of tarefas(); track t.id) {
          <li class="flex items-start gap-3">
            <input
              type="checkbox"
              class="mt-1 size-5"
              [id]="'t' + t.id"
              [checked]="t.feitaHoje"
              [disabled]="ocupado()"
              (change)="alternar(t)"
            />
            <label [for]="'t' + t.id" class="leading-snug">
              {{ t.descricao }}
              <span class="text-muted-foreground block text-sm">{{ rotulo[t.frequencia] }}</span>
            </label>
          </li>
        }
      </ul>
    }
    @if (erro()) { <p role="alert" class="text-destructive mt-3 font-semibold">{{ erro() }}</p> }
  `,
})
export class Combinados {
  private readonly api = inject(ApiService);

  readonly tarefas = input.required<TarefaDia[]>();
  readonly mudou = output<{ id: string; feita: boolean }>();

  protected readonly rotulo = ROTULO_FREQUENCIA;
  protected readonly ocupado = signal(false);
  protected readonly erro = signal('');

  protected async alternar(t: TarefaDia): Promise<void> {
    this.ocupado.set(true);
    this.erro.set('');
    try {
      const r = await this.api.marcarTarefa(t.id);
      this.mudou.emit({ id: t.id, feita: r.feita });
    } catch (e) {
      this.erro.set(lerErro(e).mensagem);
    } finally {
      this.ocupado.set(false);
    }
  }
}
