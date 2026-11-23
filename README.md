# psiapoio-frontend

Front **Angular 22** do **PsiApoio**: o painel do psicólogo e a conversa do paciente. Fala só com a [API .NET](https://github.com/danielbmendprofissional/psiapoio-api); nunca com o serviço do agente (ADR 0003). Parte do projeto [PsiApoio](https://github.com/danielbmendprofissional/psiapoio).

| Repositório | Papel |
|---|---|
| [psiapoio](https://github.com/danielbmendprofissional/psiapoio) | Vitrine e visão geral |
| [psiapoio-workspace](https://github.com/danielbmendprofissional/psiapoio-workspace) | Specs, ADRs, glossário |
| [psiapoio-api](https://github.com/danielbmendprofissional/psiapoio-api) | API .NET |
| **psiapoio-frontend** (este) | Front Angular |
| [psiapoio-agent](https://github.com/danielbmendprofissional/psiapoio-agent) | Serviço Python do agente |

## Telas

**Paciente**
- *Primeiros passos:* **Consentimento** (o psicólogo lê toda a conversa) e formulário pessoal.
- *Conversa:* chat com o agente, humor de 1 a 5, limite do dia, rascunho preservado em caso de erro.
- *Meus combinados:* **Tarefas** marcadas pelo próprio paciente, uma vez por dia.

**Psicólogo**
- *Pacientes:* lista ordenada por alerta (risco primeiro), com perfil e última mensagem.
- *Cadastrar paciente:* envia o convite por e-mail e mostra o link copiável.
- *Detalhe do paciente:* abas **Conversa e alertas** (transcrição com risco e atenção destacados, mensagens "não classificadas" marcadas), **Acompanhamento** (formulário clínico, aprovar ou reprovar o **Perfil do agente**) e **Resumo e pauta**.

## Stack e decisões

Angular 22 (standalone, zoneless, signals), [spartan/ui](https://spartan.ng) + Tailwind 4, ícones lucide, Figtree + Source Sans 3. Direção de design no ADR 0005 do workspace (calma, tema claro, status nunca só por cor: ícone + rótulo + cor) e em `DESIGN.md` / `PRODUCT.md`.

**Sessão (ADR 0006):** o JWT fica em cookie httpOnly; o JavaScript nunca o vê. O `AuthService` consulta `GET /api/v1/usuarios/me` no boot e guarda o usuário num signal; guards por papel (`Psicologo` / `Paciente`); um interceptor leva ao login quando a API devolve `401` (sessão de 60 min).

## Rodar

Pré-requisitos: Node 24+ e a [API](https://github.com/danielbmendprofissional/psiapoio-api) rodando em `http://localhost:5159`.

```bash
npm install
npm start                      # http://localhost:4200, com proxy /api -> localhost:5159
# se a porta 4200 estiver ocupada:
npx ng serve --port 4300
```

O proxy está em `proxy.conf.json`. Em dev, o psicólogo é `psicologo@psiapoio.dev` / `Psi12345` (semeado pela API).

## Scripts

```bash
npm run build                  # build de produção em dist/
npx ng test --watch=false      # testes (Vitest)
```

## Estrutura

```
src/app/
  core/        api.service, auth.service, guards + interceptor, models
  layout/      shell (header fixo + menu por papel) e layout do app
  shared/      badges de status (nível de alerta, perfil)
  shared/ui/   componentes spartan (button, input, badge, table...)
  features/    login, definir-senha, paciente/*, psicologo/*
```

Testes: guards por papel e tratamento de erro da API. As telas foram verificadas manualmente no navegador (desktop e 390 px).

## Observação

Só dados fictícios (ADR 0004). A branch `prototype/descartavel` guarda os protótipos aprovados que originaram as telas.
