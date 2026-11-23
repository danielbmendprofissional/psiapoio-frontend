import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBadgeCheck,
  lucideCircleCheck,
  lucideClock,
  lucideLoaderCircle,
  lucideOctagonAlert,
  lucideRefreshCw,
  lucideSend,
  lucideTriangleAlert,
} from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { HlmTableImports } from '@spartan-ng/helm/table';

type Nivel = 'risco' | 'atencao' | 'nenhum';

interface PacienteFicticio {
  nome: string;
  nivel: Nivel;
  ultima: string;
  humor: string;
  perfilAprovado: boolean;
}

@Component({
  selector: 'psi-amostra',
  templateUrl: './amostra.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIcon,
    HlmAlertImports,
    HlmBadge,
    HlmButton,
    HlmInput,
    HlmLabel,
    HlmSkeleton,
    HlmTableImports,
  ],
  providers: [
    provideIcons({
      lucideBadgeCheck,
      lucideCircleCheck,
      lucideClock,
      lucideLoaderCircle,
      lucideOctagonAlert,
      lucideRefreshCw,
      lucideSend,
      lucideTriangleAlert,
    }),
  ],
})
export class AmostraPage {
  protected readonly escalaEspaco = [1, 2, 3, 4, 6, 8, 12, 16];

  protected readonly pacientes: PacienteFicticio[] = [
    { nome: 'Helena Marques', nivel: 'risco', ultima: 'hoje, 09:12', humor: 'Muito baixo', perfilAprovado: true },
    { nome: 'Rafael Tavares', nivel: 'atencao', ultima: 'hoje, 07:40', humor: 'Baixo', perfilAprovado: true },
    { nome: 'Camila Duarte', nivel: 'nenhum', ultima: 'ontem, 21:05', humor: 'Estável', perfilAprovado: true },
    { nome: 'Otávio Nogueira', nivel: 'nenhum', ultima: 'ontem, 18:22', humor: 'Bom', perfilAprovado: true },
    { nome: 'Beatriz Lemos', nivel: 'nenhum', ultima: 'sem conversa', humor: '—', perfilAprovado: false },
  ];

  protected readonly enviando = signal(false);

  protected alternarEnvio(): void {
    this.enviando.update((v) => !v);
  }
}
