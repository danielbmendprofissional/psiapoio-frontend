import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideUserPlus } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { ApiService, lerErro } from '../../core/api.service';
import { PacienteLista } from '../../core/models';
import { NivelBadge, PerfilStatusBadge } from '../../shared/status.components';

/** Lista por alerta: quem exige atenção sobe (risco, atenção, o resto por atividade). */
@Component({
  selector: 'psi-pacientes',
  imports: [RouterLink, DatePipe, NgIcon, HlmButton, NivelBadge, PerfilStatusBadge],
  providers: [provideIcons({ lucideUserPlus })],
  template: `
    <div class="px-5 py-6 lg:px-10">
      <header class="flex flex-wrap items-center justify-between gap-3">
        <h1 class="text-3xl font-semibold">Pacientes</h1>
        <a hlmBtn routerLink="/pacientes/novo"><ng-icon name="lucideUserPlus" aria-hidden="true" />Cadastrar paciente</a>
      </header>

      @if (erro()) {
        <p role="alert" class="text-destructive mt-6 font-semibold">{{ erro() }}</p>
      } @else if (carregando()) {
        <p class="text-muted-foreground mt-6">Carregando…</p>
      } @else if (lista().length === 0) {
        <p class="text-muted-foreground mt-8 max-w-prose text-lg">Você ainda não tem pacientes. Cadastre o primeiro: ele recebe um convite por e-mail para criar a senha.</p>
      } @else {
        <div class="mt-6 overflow-x-auto rounded-(--radius-surface) border">
          <table class="w-full text-start">
            <caption class="sr-only">Pacientes ordenados por alerta</caption>
            <thead class="bg-muted text-start text-sm">
              <tr>
                <th scope="col" class="px-4 py-3 text-start font-semibold">Paciente</th>
                <th scope="col" class="px-4 py-3 text-start font-semibold">Alerta</th>
                <th scope="col" class="px-4 py-3 text-start font-semibold">Acompanhamento</th>
                <th scope="col" class="px-4 py-3 text-start font-semibold">Última mensagem</th>
              </tr>
            </thead>
            <tbody>
              @for (p of lista(); track p.id) {
                <tr class="border-t" [class.bg-status-risco-linha]="p.nivelAlerta === 'risco'">
                  <td class="px-4 py-3">
                    <a [routerLink]="['/pacientes', p.id]" class="text-primary font-semibold underline-offset-4 hover:underline" [class.font-bold]="p.nivelAlerta === 'risco'">{{ p.nome }}</a>
                    <span class="text-muted-foreground block text-sm">{{ p.email }}</span>
                  </td>
                  <td class="px-4 py-3">
                    <psi-nivel [nivel]="p.nivelAlerta" />
                    @if (p.alertasNaoLidos > 0) { <span class="text-muted-foreground ms-2 text-sm tabular-nums">{{ p.alertasNaoLidos }} novo(s)</span> }
                  </td>
                  <td class="px-4 py-3">
                    @if (p.status === 'convidado') {
                      <span class="text-muted-foreground">Convite enviado</span>
                    } @else {
                      <psi-perfil-status [status]="p.perfilStatus" />
                    }
                  </td>
                  <td class="text-muted-foreground px-4 py-3 tabular-nums">
                    {{ p.ultimaMensagemEm ? (p.ultimaMensagemEm | date: "dd/MM 'às' HH:mm") : 'Sem conversa' }}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class PacientesPage {
  private readonly api = inject(ApiService);
  protected readonly lista = signal<PacienteLista[]>([]);
  protected readonly carregando = signal(true);
  protected readonly erro = signal('');

  constructor() {
    void this.carregar();
  }

  private async carregar(): Promise<void> {
    try {
      this.lista.set(await this.api.pacientes());
    } catch (e) {
      this.erro.set(lerErro(e).mensagem);
    } finally {
      this.carregando.set(false);
    }
  }
}
