import { Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBadgeCheck,
  lucideCircleCheck,
  lucideClock,
  lucideOctagonAlert,
  lucidePencil,
  lucideTriangleAlert,
  lucideXCircle,
} from '@ng-icons/lucide';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { Nivel, PerfilStatus } from '../core/models';

/** Status do Alerta: ícone + rótulo + cor, nunca só cor (ADR 0005). */
@Component({
  selector: 'psi-nivel',
  imports: [NgIcon, HlmBadge],
  providers: [provideIcons({ lucideCircleCheck, lucideOctagonAlert, lucideTriangleAlert })],
  template: `
    @switch (nivel()) {
      @case ('risco') {
        <span hlmBadge variant="risco"><ng-icon name="lucideOctagonAlert" aria-hidden="true" />Risco</span>
      }
      @case ('atencao') {
        <span hlmBadge variant="atencao"><ng-icon name="lucideTriangleAlert" aria-hidden="true" />Atenção</span>
      }
      @default {
        <span hlmBadge variant="nenhum"><ng-icon name="lucideCircleCheck" aria-hidden="true" />Sem alerta</span>
      }
    }
  `,
})
export class NivelBadge {
  readonly nivel = input.required<Nivel>();
}

@Component({
  selector: 'psi-perfil-status',
  imports: [NgIcon, HlmBadge],
  providers: [provideIcons({ lucideBadgeCheck, lucideClock, lucidePencil, lucideXCircle })],
  template: `
    @switch (status()) {
      @case ('aprovado') {
        <span hlmBadge variant="aprovado"><ng-icon name="lucideBadgeCheck" aria-hidden="true" />Perfil aprovado</span>
      }
      @case ('pendente') {
        <span hlmBadge variant="pendente"><ng-icon name="lucideClock" aria-hidden="true" />Perfil pendente</span>
      }
      @case ('reprovado') {
        <span hlmBadge variant="risco"><ng-icon name="lucideXCircle" aria-hidden="true" />Perfil reprovado</span>
      }
      @default {
        <span hlmBadge variant="pendente"><ng-icon name="lucidePencil" aria-hidden="true" />Perfil em rascunho</span>
      }
    }
  `,
})
export class PerfilStatusBadge {
  readonly status = input.required<PerfilStatus>();
}
