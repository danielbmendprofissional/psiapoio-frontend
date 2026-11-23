import { HttpClient } from '@angular/common/http';
import { Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { firstValueFrom } from 'rxjs';
import { lerErro } from '../../core/api.service';

/** Destino do link do Convite: o Paciente cria a senha e depois entra (ADR 0006). */
@Component({
  selector: 'psi-definir-senha',
  imports: [HlmButton, HlmInput, HlmLabel, RouterLink],
  template: `
    <main class="grid min-h-dvh place-items-center px-4 py-10">
      <section class="w-full max-w-sm" aria-labelledby="titulo">
        <p class="font-display text-primary text-xl font-semibold">PsiApoio</p>
        <h1 id="titulo" class="mt-2 text-3xl font-semibold">Crie sua senha</h1>

        @if (pronto()) {
          <p role="status" class="bg-secondary text-secondary-foreground mt-5 rounded-md px-4 py-3">
            Senha criada. Agora é só entrar.
          </p>
          <a hlmBtn routerLink="/login" class="mt-5 w-full">Ir para o login</a>
        } @else if (!email() || !token()) {
          <p role="alert" class="text-destructive mt-5 font-semibold">
            Este link está incompleto. Peça um novo convite ao seu psicólogo.
          </p>
        } @else {
          <p class="text-muted-foreground mt-2">Conta: {{ email() }}</p>
          <form class="mt-6 space-y-4" (submit)="enviar($event)">
            <div class="grid gap-1.5">
              <label hlmLabel for="senha">Senha</label>
              <input hlmInput id="senha" type="password" autocomplete="new-password" required minlength="8" aria-describedby="dica" [value]="senha()" (input)="senha.set(valor($event))" />
              <p id="dica" class="text-muted-foreground text-sm">Pelo menos 8 caracteres, com letra e número.</p>
            </div>
            <div class="grid gap-1.5">
              <label hlmLabel for="confirma">Repita a senha</label>
              <input hlmInput id="confirma" type="password" autocomplete="new-password" required [value]="confirma()" (input)="confirma.set(valor($event))" />
            </div>
            @if (erro()) {
              <p role="alert" class="text-destructive font-semibold">{{ erro() }}</p>
            }
            <button hlmBtn type="submit" class="w-full" [disabled]="carregando()">
              {{ carregando() ? 'Salvando…' : 'Criar senha' }}
            </button>
          </form>
        }
      </section>
    </main>
  `,
})
export class DefinirSenhaPage {
  private readonly http = inject(HttpClient);

  readonly email = input<string>();
  readonly token = input<string>();

  protected readonly senha = signal('');
  protected readonly confirma = signal('');
  protected readonly erro = signal('');
  protected readonly carregando = signal(false);
  protected readonly pronto = signal(false);

  protected valor(e: Event): string {
    return (e.target as HTMLInputElement).value;
  }

  protected async enviar(e: Event): Promise<void> {
    e.preventDefault();
    this.erro.set('');
    if (this.senha() !== this.confirma()) {
      this.erro.set('As senhas não são iguais.');
      return;
    }
    this.carregando.set(true);
    try {
      await firstValueFrom(
        this.http.post('/api/v1/auth/definir-senha', {
          email: this.email(),
          token: this.token(),
          senha: this.senha(),
        }),
      );
      this.pronto.set(true);
    } catch (err) {
      this.erro.set(lerErro(err).mensagem);
    } finally {
      this.carregando.set(false);
    }
  }
}
