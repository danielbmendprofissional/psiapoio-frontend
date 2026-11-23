import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Usuario } from './models';

/**
 * Sessão no front (ADR 0006): o JWT vive em cookie httpOnly e o JavaScript nunca o vê.
 * O usuário vem de GET /usuarios/me no boot e fica num signal.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly usuario = signal<Usuario | null>(null);
  readonly logado = computed(() => this.usuario() !== null);

  async carregar(): Promise<void> {
    try {
      this.usuario.set(await firstValueFrom(this.http.get<Usuario>('/api/v1/usuarios/me')));
    } catch {
      this.usuario.set(null);
    }
  }

  async entrar(email: string, senha: string): Promise<Usuario> {
    const u = await firstValueFrom(this.http.post<Usuario>('/api/v1/auth/login', { email, senha }));
    this.usuario.set(u);
    return u;
  }

  async sair(): Promise<void> {
    try {
      await firstValueFrom(this.http.post<void>('/api/v1/auth/logout', {}));
    } finally {
      this.sessaoExpirada(false);
    }
  }

  /** Token expirado (60 min, sem refresh) ou logout: limpa o estado e leva ao login. */
  sessaoExpirada(expirou = true): void {
    this.usuario.set(null);
    void this.router.navigate(['/login'], expirou ? { queryParams: { expirada: 1 } } : {});
  }

  rotaInicial(): string[] {
    const u = this.usuario();
    if (!u) return ['/login'];
    return u.papel === 'Psicologo' ? ['/pacientes'] : ['/conversa'];
  }
}
