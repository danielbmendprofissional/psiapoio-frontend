import { Component, computed, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronDown,
  lucideListChecks,
  lucideLogOut,
  lucideMenu,
  lucideMessageCircle,
  lucideUserPlus,
  lucideUsers,
  lucideX,
} from '@ng-icons/lucide';

export interface ShellItem {
  rotulo: string;
  icone: string;
  rota: string;
}

export interface ShellUsuario {
  nome: string;
  papel: string;
}

/**
 * Casca do app (padrao-frontend: layout/ sem regra de negócio): header fixo com o perfil logado
 * no canto superior direito e menu lateral. Em tela estreita o menu vira gaveta.
 */
@Component({
  selector: 'psi-shell',
  imports: [NgIcon, RouterLink, RouterLinkActive, RouterOutlet],
  providers: [
    provideIcons({
      lucideChevronDown,
      lucideListChecks,
      lucideLogOut,
      lucideMenu,
      lucideMessageCircle,
      lucideUserPlus,
      lucideUsers,
      lucideX,
    }),
  ],
  template: `
    <a
      href="#conteudo"
      class="bg-background focus:ring-ring sr-only z-50 rounded-md px-3 py-2 focus:not-sr-only focus:fixed focus:start-2 focus:top-2 focus:ring-2"
      >Ir para o conteúdo</a
    >
    <header class="bg-background fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-3 border-b px-4">
      <button
        type="button"
        class="hover:bg-muted -ms-2 grid size-10 place-items-center rounded-md lg:hidden"
        [attr.aria-expanded]="gaveta()"
        aria-controls="menu-lateral"
        aria-label="Abrir menu"
        (click)="gaveta.set(!gaveta())"
      >
        <ng-icon [name]="gaveta() ? 'lucideX' : 'lucideMenu'" size="20" aria-hidden="true" />
      </button>

      <span class="font-display text-lg font-semibold">PsiApoio</span>

      <div class="relative ms-auto">
        <button
          type="button"
          class="hover:bg-muted flex items-center gap-2.5 rounded-md py-1.5 ps-1.5 pe-2.5"
          [attr.aria-expanded]="perfilAberto()"
          aria-haspopup="menu"
          (click)="perfilAberto.set(!perfilAberto())"
        >
          <span
            class="bg-secondary text-secondary-foreground grid size-8 place-items-center rounded-full text-sm font-semibold"
            aria-hidden="true"
            >{{ iniciais() }}</span
          >
          <span class="hidden text-start leading-tight sm:block">
            <span class="block text-sm font-semibold">{{ usuario().nome }}</span>
            <span class="text-muted-foreground block text-xs">{{ usuario().papel }}</span>
          </span>
          <ng-icon name="lucideChevronDown" size="16" aria-hidden="true" />
        </button>

        @if (perfilAberto()) {
          <div role="menu" class="bg-popover absolute end-0 top-full mt-1 w-56 rounded-md border p-1">
            <p class="border-b px-3 py-2 sm:hidden">
              <span class="block text-sm font-semibold">{{ usuario().nome }}</span>
              <span class="text-muted-foreground block text-xs">{{ usuario().papel }}</span>
            </p>
            <button
              role="menuitem"
              type="button"
              class="hover:bg-muted flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm"
              (click)="sair.emit()"
            >
              <ng-icon name="lucideLogOut" aria-hidden="true" /> Sair
            </button>
          </div>
        }
      </div>
    </header>

    @if (gaveta()) {
      <button
        type="button"
        class="bg-foreground/30 fixed inset-0 z-20 lg:hidden"
        aria-label="Fechar menu"
        (click)="gaveta.set(false)"
      ></button>
    }

    <nav
      id="menu-lateral"
      aria-label="Principal"
      class="bg-sidebar fixed top-14 bottom-0 start-0 z-20 w-56 overflow-y-auto border-e p-3 lg:translate-x-0"
      [class.-translate-x-full]="!gaveta()"
    >
      <ul class="space-y-1">
        @for (item of itens(); track item.rota) {
          <li>
            <a
              [routerLink]="item.rota"
              routerLinkActive="bg-accent text-accent-foreground"
              ariaCurrentWhenActive="page"
              class="hover:bg-muted flex w-full items-center gap-3 rounded-md px-3 py-2.5 font-medium"
              (click)="gaveta.set(false)"
            >
              <ng-icon [name]="item.icone" size="18" aria-hidden="true" />
              {{ item.rotulo }}
            </a>
          </li>
        }
      </ul>
    </nav>

    <main id="conteudo" class="pt-14 lg:ps-56" tabindex="-1">
      <router-outlet />
    </main>
  `,
})
export class Shell {
  readonly usuario = input.required<ShellUsuario>();
  readonly itens = input.required<ShellItem[]>();
  readonly sair = output<void>();

  protected readonly gaveta = signal(false);
  protected readonly perfilAberto = signal(false);

  protected readonly iniciais = computed(() =>
    this.usuario()
      .nome.split(' ')
      .filter((p) => /^[A-ZÀ-Ú]/.test(p))
      .slice(0, 2)
      .map((p) => p[0])
      .join(''),
  );
}
