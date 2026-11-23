import { ChangeDetectionStrategy, Component, HostListener, inject, input, isDevMode } from '@angular/core';
import { Router } from '@angular/router';

// PROTÓTIPO DESCARTÁVEL: barra flutuante que troca ?variant= (setas ← → também).
@Component({
  selector: 'psi-proto-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (dev) {
      <div
        class="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-foreground py-2 ps-3 pe-3 text-sm text-background"
        style="margin-bottom: env(safe-area-inset-bottom, 0px)"
        role="group"
        aria-label="Trocar variante do protótipo"
      >
        <button type="button" class="size-9 rounded-full hover:bg-background/15" aria-label="Variante anterior" (click)="ir(-1)">←</button>
        <span class="min-w-40 text-center font-semibold">{{ current() }} · {{ nomes()[current()] }}</span>
        <button type="button" class="size-9 rounded-full hover:bg-background/15" aria-label="Próxima variante" (click)="ir(1)">→</button>
      </div>
    }
  `,
})
export class PrototypeSwitcher {
  private readonly router = inject(Router);
  protected readonly dev = isDevMode();

  readonly variants = input.required<string[]>();
  readonly nomes = input.required<Record<string, string>>();
  readonly current = input.required<string>();

  protected ir(delta: number): void {
    const v = this.variants();
    const i = v.indexOf(this.current());
    const next = v[(i + delta + v.length) % v.length];
    void this.router.navigate([], { queryParams: { variant: next }, queryParamsHandling: 'merge', replaceUrl: true });
  }

  @HostListener('document:keydown', ['$event'])
  protected onKey(e: KeyboardEvent): void {
    const el = e.target as HTMLElement | null;
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
    if (e.key === 'ArrowLeft') this.ir(-1);
    if (e.key === 'ArrowRight') this.ir(1);
  }
}
