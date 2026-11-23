import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { provideRouter } from '@angular/router';
import { lerErro } from './api.service';
import { AuthService } from './auth.service';
import { authGuard, inicioGuard, papelGuard } from './guards';

function rodar(guard: () => unknown): unknown {
  return TestBed.runInInjectionContext(guard as () => unknown);
}

describe('guards e sessão', () => {
  let auth: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    auth = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  const url = (r: unknown) => router.serializeUrl(r as UrlTree);

  it('sem sessão, authGuard manda ao login', () => {
    expect(url(rodar(() => authGuard({} as never, {} as never)))).toBe('/login');
  });

  it('com sessão, authGuard libera', () => {
    auth.usuario.set({ id: '1', nome: 'A', email: 'a@a', papel: 'Paciente' });
    expect(rodar(() => authGuard({} as never, {} as never))).toBe(true);
  });

  it('papel errado volta para a tela inicial do próprio papel', () => {
    auth.usuario.set({ id: '1', nome: 'A', email: 'a@a', papel: 'Paciente' });
    expect(url(rodar(() => papelGuard('Psicologo')({} as never, {} as never)))).toBe('/conversa');
    auth.usuario.set({ id: '2', nome: 'B', email: 'b@b', papel: 'Psicologo' });
    expect(url(rodar(() => papelGuard('Paciente')({} as never, {} as never)))).toBe('/pacientes');
  });

  it('papel certo é liberado e a raiz redireciona por papel', () => {
    auth.usuario.set({ id: '2', nome: 'B', email: 'b@b', papel: 'Psicologo' });
    expect(rodar(() => papelGuard('Psicologo')({} as never, {} as never))).toBe(true);
    expect(url(rodar(() => inicioGuard({} as never, {} as never)))).toBe('/pacientes');
  });
});

describe('lerErro', () => {
  it('extrai codigo e mensagem do problem+json', () => {
    const e = new HttpErrorResponse({ status: 429, error: { codigo: 'limite_diario', title: 'Limite de hoje.' } });
    expect(lerErro(e)).toEqual({ status: 429, codigo: 'limite_diario', mensagem: 'Limite de hoje.' });
  });

  it('sem conexão devolve mensagem amigável', () => {
    const e = new HttpErrorResponse({ status: 0 });
    expect(lerErro(e).codigo).toBe('sem_conexao');
  });
});
