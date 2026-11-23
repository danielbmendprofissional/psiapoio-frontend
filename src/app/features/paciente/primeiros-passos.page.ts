import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { ApiService, lerErro } from '../../core/api.service';

/** Consentimento e formulário pessoal: tudo que vem antes da primeira mensagem (CONTEXT.md). */
@Component({
  selector: 'psi-primeiros-passos',
  imports: [HlmButton, HlmInput, HlmLabel],
  template: `
    <div class="mx-auto max-w-2xl px-4 py-8">
      @if (carregando()) {
        <p class="text-muted-foreground">Carregando…</p>
      } @else if (!consentido()) {
        <h1 class="text-3xl font-semibold">Antes de começar</h1>
        <div class="mt-5 max-w-prose space-y-4 text-lg">
          <p>Eu sou o companheiro do seu acompanhamento. Não sou terapeuta: ajudo a lembrar do que você combinou com o seu psicólogo e a registrar como você está.</p>
          <p><strong>O seu psicólogo lê toda a conversa</strong> e recebe um aviso se alguma mensagem pedir atenção. Não prometo sigilo.</p>
          <p>Eu não faço diagnóstico nem dou conselho clínico. Se você trouxer algo assim, eu deixo registrado para vocês conversarem na sessão.</p>
        </div>
        @if (erro()) { <p role="alert" class="text-destructive mt-4 font-semibold">{{ erro() }}</p> }
        <button hlmBtn class="mt-6" [disabled]="salvando()" (click)="aceitar()">Entendi e concordo em conversar</button>
      } @else {
        <h1 class="text-3xl font-semibold">Conte um pouco sobre você</h1>
        <p class="text-muted-foreground mt-2 max-w-prose">Isso ajuda a conversa a ter o seu jeito. O seu psicólogo revisa as respostas antes de a conversa começar.</p>
        <form class="mt-6 space-y-5" (submit)="enviar($event)">
          <div class="grid gap-1.5">
            <label hlmLabel for="nome">Como você prefere ser chamado?</label>
            <input hlmInput id="nome" required maxlength="60" [value]="nome()" (input)="nome.set(valor($event))" />
          </div>
          <div class="grid gap-1.5">
            <label hlmLabel for="rotina">Sua rotina (quando acorda, trabalho ou estudo, quando dorme)</label>
            <input hlmInput id="rotina" maxlength="200" [value]="rotina()" (input)="rotina.set(valor($event))" />
          </div>
          <div class="grid gap-1.5">
            <label hlmLabel for="ajuda">O que costuma ajudar quando você está mal?</label>
            <input hlmInput id="ajuda" maxlength="200" [value]="ajuda()" (input)="ajuda.set(valor($event))" />
          </div>
          <div class="grid gap-1.5">
            <label hlmLabel for="evitar">Algum assunto que prefere que eu evite?</label>
            <input hlmInput id="evitar" maxlength="200" [value]="evitar()" (input)="evitar.set(valor($event))" />
          </div>
          <fieldset class="grid gap-2">
            <legend class="font-semibold">Tom da conversa</legend>
            <label class="flex items-center gap-2"><input type="radio" name="tom" class="size-5" value="acolhedor" [checked]="tom() === 'acolhedor'" (change)="tom.set('acolhedor')" /> Mais acolhedor</label>
            <label class="flex items-center gap-2"><input type="radio" name="tom" class="size-5" value="direto" [checked]="tom() === 'direto'" (change)="tom.set('direto')" /> Mais direto</label>
          </fieldset>
          @if (erro()) { <p role="alert" class="text-destructive font-semibold">{{ erro() }}</p> }
          <button hlmBtn type="submit" [disabled]="salvando()">Enviar para o meu psicólogo</button>
        </form>
      }
    </div>
  `,
})
export class PrimeirosPassosPage {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  protected readonly carregando = signal(true);
  protected readonly salvando = signal(false);
  protected readonly consentido = signal(false);
  protected readonly erro = signal('');
  protected readonly nome = signal('');
  protected readonly rotina = signal('');
  protected readonly ajuda = signal('');
  protected readonly evitar = signal('');
  protected readonly tom = signal<'acolhedor' | 'direto'>('acolhedor');

  constructor() {
    void this.carregar();
  }

  protected valor(e: Event): string {
    return (e.target as HTMLInputElement).value;
  }

  private async carregar(): Promise<void> {
    try {
      const a = await this.api.meuAcompanhamento();
      this.consentido.set(a.consentimentoEm !== null);
      if (a.pessoal) {
        this.nome.set(a.pessoal.comoPrefereSerChamado);
        this.rotina.set(a.pessoal.rotina ?? '');
        this.ajuda.set(a.pessoal.oQueAjuda ?? '');
        this.evitar.set(a.pessoal.evitar ?? '');
        this.tom.set(a.pessoal.tom);
      } else {
        this.nome.set(a.nome.split(' ')[0]);
      }
    } catch (e) {
      this.erro.set(lerErro(e).mensagem);
    } finally {
      this.carregando.set(false);
    }
  }

  protected async aceitar(): Promise<void> {
    this.salvando.set(true);
    this.erro.set('');
    try {
      await this.api.consentir();
      this.consentido.set(true);
    } catch (e) {
      this.erro.set(lerErro(e).mensagem);
    } finally {
      this.salvando.set(false);
    }
  }

  protected async enviar(ev: Event): Promise<void> {
    ev.preventDefault();
    this.salvando.set(true);
    this.erro.set('');
    try {
      await this.api.salvarPessoal({
        comoPrefereSerChamado: this.nome(),
        rotina: this.rotina(),
        oQueAjuda: this.ajuda(),
        evitar: this.evitar(),
        tom: this.tom(),
      });
      await this.router.navigate(['/conversa']);
    } catch (e) {
      this.erro.set(lerErro(e).mensagem);
    } finally {
      this.salvando.set(false);
    }
  }
}
