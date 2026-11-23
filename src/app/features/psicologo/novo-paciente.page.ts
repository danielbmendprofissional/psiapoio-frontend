import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { ApiService, lerErro } from '../../core/api.service';
import { Convite } from '../../core/models';

@Component({
  selector: 'psi-novo-paciente',
  imports: [HlmButton, HlmInput, HlmLabel, RouterLink],
  template: `
    <div class="mx-auto max-w-xl px-5 py-8">
      <h1 class="text-3xl font-semibold">Cadastrar paciente</h1>

      @if (convite(); as c) {
        <div class="mt-6 space-y-4" role="status">
          <p class="bg-secondary text-secondary-foreground rounded-md px-4 py-3">
            @if (c.emailEnviado) { Convite enviado para {{ email() }}. O link vale por 72 horas. }
            @else { O e-mail não saiu agora. Copie o link abaixo e envie ao paciente. }
          </p>
          <div class="grid gap-1.5">
            <label hlmLabel for="link">Link do convite</label>
            <input hlmInput id="link" readonly [value]="c.linkConvite" (focus)="selecionar($event)" />
          </div>
          <div class="flex flex-wrap gap-3">
            <button hlmBtn variant="outline" type="button" (click)="copiar(c.linkConvite)">{{ copiado() ? 'Link copiado' : 'Copiar link' }}</button>
            <a hlmBtn [routerLink]="['/pacientes', c.id]">Configurar o acompanhamento</a>
          </div>
        </div>
      } @else {
        <p class="text-muted-foreground mt-2">O paciente recebe um convite por e-mail para criar a senha.</p>
        <form class="mt-6 space-y-4" (submit)="enviar($event)">
          <div class="grid gap-1.5">
            <label hlmLabel for="nome">Nome</label>
            <input hlmInput id="nome" required maxlength="120" [value]="nome()" (input)="nome.set(valor($event))" />
          </div>
          <div class="grid gap-1.5">
            <label hlmLabel for="email">E-mail</label>
            <input hlmInput id="email" type="email" required [value]="email()" (input)="email.set(valor($event))" />
          </div>
          @if (erro()) { <p role="alert" class="text-destructive font-semibold">{{ erro() }}</p> }
          <button hlmBtn type="submit" [disabled]="enviando()">{{ enviando() ? 'Cadastrando…' : 'Cadastrar e enviar convite' }}</button>
        </form>
      }
    </div>
  `,
})
export class NovoPacientePage {
  private readonly api = inject(ApiService);
  protected readonly nome = signal('');
  protected readonly email = signal('');
  protected readonly erro = signal('');
  protected readonly enviando = signal(false);
  protected readonly convite = signal<Convite | null>(null);
  protected readonly copiado = signal(false);

  protected valor(e: Event): string {
    return (e.target as HTMLInputElement).value;
  }

  protected selecionar(e: Event): void {
    (e.target as HTMLInputElement).select();
  }

  protected async enviar(e: Event): Promise<void> {
    e.preventDefault();
    this.erro.set('');
    this.enviando.set(true);
    try {
      this.convite.set(await this.api.cadastrarPaciente(this.nome().trim(), this.email().trim()));
    } catch (err) {
      this.erro.set(lerErro(err).mensagem);
    } finally {
      this.enviando.set(false);
    }
  }

  protected async copiar(link: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(link);
      this.copiado.set(true);
    } catch {
      this.erro.set('Não consegui copiar. Selecione o link e copie manualmente.');
    }
  }
}
