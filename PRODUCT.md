# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Angular (zoneless, standalone) + spartan/ui + Tailwind 4, fixado por `docs/agents/padrao-frontend.md` do workspace. Texto em pt-BR direto no template (sem i18n).

## Users

- **Psicólogo**: profissional que cadastra o paciente, configura o agente (formulário clínico, tarefas, gatilhos), aprova o **Perfil do agente** e revisa **Alertas**, **Resumos diários** e **Pautas**. Usa o painel entre sessões e antes de cada sessão; precisa varrer a carteira e achar rápido quem exige atenção.
- **Paciente**: pessoa acompanhada, que conversa com o agente entre as sessões, dá o **Consentimento**, preenche o formulário pessoal. Usa o chat em momentos emocionalmente sensíveis, muitas vezes no celular.

## Product Purpose

Um agente de IA acompanha o paciente entre as sessões de psicologia, sob configuração e supervisão do psicólogo: reforça **Tarefas** combinadas, tira dúvida de como executar um exercício, colhe **Registro de humor** e acolhe de forma breve. Sucesso: o psicólogo chega à sessão com **Resumo diário** e **Pauta** e é avisado por **Alerta** quando uma mensagem é classificada como `atenção` ou `risco`; o paciente se sente acolhido sem que o agente vire terapeuta. MVP de trabalho de faculdade, dados fictícios.

## Positioning

Não é terapia por IA nem bem-estar genérico: é uma extensão supervisionada do psicólogo. O agente tem escopo fechado, só trabalha com conteúdo aprovado pelo psicólogo e o psicólogo lê a transcrição completa (ADR 0001).

## Operating Context

- Painel do psicólogo: lista por alerta, cadastro, detalhe do paciente, aprovação do perfil. Paciente: chat, consentimento, formulário.
- Login por e-mail e senha, papéis `Psicólogo` e `Paciente`; cada um vê só os próprios dados.
- Em `risco`, a resposta ao paciente é uma mensagem fixa (não gerada pelo LLM); o **Alerta** aparece no painel e por e-mail sem conteúdo clínico (ADR 0002). Mensagem sem classificação nunca é tratada como "sem risco".

## Capabilities and Constraints

- Vocabulário obrigatório na UI (`CONTEXT.md`): Psicólogo, Paciente, Acompanhamento, Perfil do agente, Tarefa, Gatilho, Conversa, Registro de humor, Alerta, Resumo diário, Pauta, Consentimento. Evitar: terapeuta, cliente, caso, prontuário, prompt, persona, chat, check-in, notificação, laudo, relatório.
- O Angular nunca fala com o serviço Python; só com a API .NET (ADR 0003).
- Fora do MVP: pagamento, integrações, app móvel, LGPD completa, notificações além do e-mail.
- Encaminhamento a serviço de emergência não existe no MVP, por decisão do autor (ADR 0002).

## Brand Commitments

Direção em `docs/adr/0005-direcao-de-design.md`. Texto de UI acolhedor e natural, sem cara de chatbot e sem tom clínico frio. Marca ainda sem logo.

## Evidence on Hand

Sem depoimentos, clientes, métricas ou referências visuais externas. Não fabricar. Dados de demonstração são fictícios.

## Product Principles

1. O psicólogo está no controle: nada do agente vale sem aprovação dele, e ele sempre vê o que o paciente vê.
2. Risco nunca se perde: um sinal de atenção ou risco é impossível de deixar passar, e nunca depende só de cor.
3. Acolher sem aconselhar: a interface do paciente é calma e curta, nunca finge ser terapeuta.
4. Transparência com o paciente: ele sabe, desde o Consentimento, que o psicólogo lê a conversa.

## Accessibility & Inclusion

WCAG 2.1 AA em toda tela nova (axe-core), foco visível, nada comunicado só por cor, teclado completo, texto legível em celular (contexto de uso do paciente).
