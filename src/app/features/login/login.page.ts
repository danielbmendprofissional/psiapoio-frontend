import { Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { lerErro } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'psi-login',
  imports: [HlmButton, HlmInput, HlmLabel],
  template: `
    <main class="grid min-h-dvh place-items-center px-4 py-10">
      <section class="w-full max-w-sm" aria-labelledby="titulo">
        <p class="font-display text-primary text-xl font-semibold">PsiApoio</p>
        <h1 id="titulo" class="mt-2 text-3xl font-semibold">Entrar</h1>
        <p class="text-muted-foreground mt-2">Use o e-mail e a senha do seu acompanhamento.</p>

        @if (expirada()) {
          <p role="status" class="bg-muted mt-5 rounded-md px-4 py-3">Sua sessão terminou. Entre de novo para continuar.</p>
        }

        <form class="mt-6 space-y-4" (submit)="enviar($event)">
          <div class="grid gap-1.5">
            <label hlmLabel for="email">E-mail</label>
            <input hlmInput id="email" type="email" autocomplete="username" required [value]="email()" (input)="email.set(valor($event))" />
          </div>
          <div class="grid gap-1.5">
            <label hlmLabel for="senha">Senha</label>
            <input hlmInput id="senha" type="password" autocomplete="current-password" required [value]="senha()" (input)="senha.set(valor($event))" />
          </div>
          @if (erro()) {
            <p role="alert" class="text-destructive font-semibold">{{ erro() }}</p>
          }
          <button hlmBtn type="submit" class="w-full" [disabled]="carregando()">
            {{ carregando() ? 'Entrando…' : 'Entrar' }}
          </button>
        </form>
      </section>
    </main>
  `,
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly expirada = input<string>();

  protected readonly email = signal('');
  protected readonly senha = signal('');
  protected readonly erro = signal('');
  protected readonly carregando = signal(false);

  protected valor(e: Event): string {
    return (e.target as HTMLInputElement).value;
  }

  protected async enviar(e: Event): Promise<void> {
    e.preventDefault();
    this.erro.set('');
    this.carregando.set(true);
    try {
      await this.auth.entrar(this.email().trim(), this.senha());
      await this.router.navigate(this.auth.rotaInicial());
    } catch (err) {
      this.erro.set(lerErro(err).mensagem);
    } finally {
      this.carregando.set(false);
    }
  }
}
