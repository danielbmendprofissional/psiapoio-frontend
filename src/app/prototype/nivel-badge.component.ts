import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleCheck, lucideOctagonAlert, lucideTriangleAlert } from '@ng-icons/lucide';
import { HlmBadge } from '@spartan-ng/helm/badge';
import type { Nivel } from './prototype-data';

// PROTÓTIPO DESCARTÁVEL
@Component({
  selector: 'psi-proto-nivel',
  imports: [NgIcon, HlmBadge],
  providers: [provideIcons({ lucideCircleCheck, lucideOctagonAlert, lucideTriangleAlert })],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
