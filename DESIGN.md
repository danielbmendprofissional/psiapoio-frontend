---
name: PsiApoio
description: Painel calmo para o psicólogo e conversa tranquila para o paciente, em verde-azulado sobre neutros quentes.
colors:
  primary: "oklch(0.45 0.075 195)"
  primary-foreground: "oklch(0.985 0.006 195)"
  brand-soft: "oklch(0.94 0.02 195)"
  brand-soft-foreground: "oklch(0.33 0.06 195)"
  ring: "oklch(0.55 0.09 195)"
  background: "oklch(0.985 0.004 90)"
  surface: "oklch(0.997 0.002 90)"
  foreground: "oklch(0.24 0.012 90)"
  muted: "oklch(0.955 0.006 90)"
  muted-foreground: "oklch(0.46 0.012 90)"
  border: "oklch(0.905 0.008 90)"
  input-border: "oklch(0.62 0.012 90)"
  destructive: "oklch(0.5 0.17 27)"
  status-nenhum-bg: "oklch(0.95 0.008 90)"
  status-nenhum-fg: "oklch(0.4 0.012 90)"
  status-atencao-bg: "oklch(0.95 0.06 85)"
  status-atencao-fg: "oklch(0.4 0.09 65)"
  status-risco-bg: "oklch(0.94 0.04 25)"
  status-risco-fg: "oklch(0.42 0.15 27)"
  status-risco-linha: "oklch(0.97 0.018 25)"
  status-pendente-fg: "oklch(0.42 0.04 250)"
typography:
  display:
    fontFamily: "'Figtree Variable', 'Source Sans 3 Variable', system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "'Figtree Variable', 'Source Sans 3 Variable', system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "'Figtree Variable', 'Source Sans 3 Variable', system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'Source Sans 3 Variable', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Source Sans 3 Variable', system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.6
rounded:
  control: "8px"
  surface: "12px"
spacing:
  base: "4px"
  sm: "8px"
  md: "16px"
  lg: "32px"
  section: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.brand-soft}"
    textColor: "{colors.brand-soft-foreground}"
    rounded: "{rounded.control}"
    height: "44px"
  button-outline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.control}"
    height: "44px"
  button-destructive:
    textColor: "{colors.destructive}"
    rounded: "{rounded.control}"
    height: "44px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.control}"
    padding: "4px 12px"
    height: "44px"
  badge-risco:
    backgroundColor: "{colors.status-risco-bg}"
    textColor: "{colors.status-risco-fg}"
    rounded: "{rounded.control}"
    height: "24px"
  badge-atencao:
    backgroundColor: "{colors.status-atencao-bg}"
    textColor: "{colors.status-atencao-fg}"
    rounded: "{rounded.control}"
    height: "24px"
  badge-nenhum:
    backgroundColor: "{colors.status-nenhum-bg}"
    textColor: "{colors.status-nenhum-fg}"
    rounded: "{rounded.control}"
    height: "24px"
  badge-aprovado:
    backgroundColor: "{colors.brand-soft}"
    textColor: "{colors.brand-soft-foreground}"
    rounded: "{rounded.control}"
    height: "24px"
  badge-pendente:
    textColor: "{colors.status-pendente-fg}"
    rounded: "{rounded.control}"
    height: "24px"
  table-row-risco:
    backgroundColor: "{colors.status-risco-linha}"
    textColor: "{colors.foreground}"
---

# Design System: PsiApoio

## Overview

**Creative North Star: "O Consultório Tranquilo"**

O sistema se comporta como um consultório bem arrumado: luz clara, superfícies quentes, poucos objetos e nada que grite. O psicólogo precisa varrer uma lista e achar quem pede atenção; o paciente precisa conversar sem sentir que está num painel de controle. A mesma paleta serve aos dois, e a diferença está na densidade: o painel do psicólogo é um dashboard sóbrio (perfil Operate), a conversa do paciente é um componente de app com mais ar, frases curtas e nenhuma pressa.

A cor de marca (verde-azulado) aparece só em ação e foco. Vermelho e âmbar pertencem exclusivamente a risco e atenção, de modo que, quando aparecem, significam algo. O tema é claro, os neutros são quentes e a profundidade vem de borda e de tom, nunca de sombra.

**Key Characteristics:**
- Calmo e espaçoso: seções com 48px de respiro vertical, corpo de 16px no celular e 14px a partir de 1024px de largura (a base `html` cai para 87,5%; tudo é em rem), com entrelinha 1,6. Os valores em px deste documento são na escala de 16px; em tela larga encolhem 12%.
- Marca verde-azulada contida em ação e foco; vermelho e âmbar reservados a risco e atenção.
- Sem sombras; separação por borda de 1px e fundos tonais.
- Status nunca só por cor: ícone (lucide) + rótulo + cor.
- Alvo de toque de 44px em botões e campos.
- Títulos em Figtree, corpo em Source Sans 3, números tabulares em tabelas.

## Colors

Neutros quentes (matiz 90) como chão, um único verde-azulado (matiz 195) como voz, e uma família de status independente da marca. Valores em OKLCH, fonte canônica em `src/styles.css`.

### Primary
- **Verde-azulado Profundo** (oklch(0.45 0.075 195)): botão principal, bolha de mensagem do paciente, link. Texto sobre ele usa `primary-foreground`.
- **Verde-azulado Suave** (oklch(0.94 0.02 195), texto oklch(0.33 0.06 195)): botão secundário, selo "Perfil aprovado", seleção.
- **Verde-azulado de Foco** (oklch(0.55 0.09 195)): anel de foco de 2px com deslocamento de 2px.

### Neutral
- **Papel Quente** (oklch(0.985 0.004 90)): fundo da página.
- **Superfície Clara** (oklch(0.997 0.002 90)): campos, botão outline, alertas.
- **Areia Suave** (oklch(0.955 0.006 90)): bolhas recebidas, hover de linha, blocos de apoio.
- **Tinta Quente** (oklch(0.24 0.012 90)): texto principal.
- **Tinta de Apoio** (oklch(0.46 0.012 90)): texto secundário, cabeçalhos de tabela, legendas.
- **Fio Quente** (oklch(0.905 0.008 90)): bordas e divisores.
- **Contorno de Campo** (oklch(0.62 0.012 90)): borda de inputs e botão outline, mais forte que o fio para dar contraste de controle.

### Status (reservado)
- **Risco** (fundo oklch(0.94 0.04 25), texto oklch(0.42 0.15 27)): selo de risco. A linha da lista ganha o fundo próprio oklch(0.97 0.018 25) e nome em semibold.
- **Atenção** (fundo oklch(0.95 0.06 85), texto oklch(0.4 0.09 65)): selo de atenção.
- **Sem alerta** (fundo oklch(0.95 0.008 90), texto oklch(0.4 0.012 90)): neutro, quase invisível de propósito.
- **Perfil pendente** (texto e contorno oklch(0.42 0.04 250)): selo vazado em azul-acinzentado, fora das famílias de marca e de alerta.
- **Destrutivo / erro** (oklch(0.5 0.17 27)): erro de formulário, alerta de falha e ação destrutiva; mesmo vermelho do risco.

### Named Rules
**The Red-Amber Reserve Rule.** Vermelho e âmbar só existem para risco, atenção e erro. A marca nunca usa essas famílias, e nada decorativo as usa.

**The Brand-on-Action Rule.** O verde-azulado marca o que se pode fazer (ação, foco, mensagem própria). Não pinta fundos de seção nem decoração.

**The Never-Color-Alone Rule.** Todo status carrega ícone, rótulo e cor; sem a cor, ainda deve dar para distinguir.

## Typography

**Display Font:** Figtree Variable (com Source Sans 3 Variable, system-ui, sans-serif)
**Body Font:** Source Sans 3 Variable (com system-ui, sans-serif)

**Character:** Figtree dá títulos acolhedores e geométricos sem ficar infantil; Source Sans 3 é neutra e legível para transcrições longas.

### Hierarchy
- **Display** (600, 3rem em telas md+, 2.25rem abaixo, 1.2): título de página (h1) da amostra; um por tela.
- **Headline** (600, 1.5rem, 1.2): título de seção (h2).
- **Title** (600, 1.25rem a 1.125rem, 1.2): subtítulos e nomes de bloco (h3).
- **Body** (400, 1rem, 1.6): texto corrido e transcrições, limite de linha `max-w-prose`.
- **Label** (600, 0.875rem): rótulos de campo, selos, cabeçalho de tabela, botões pequenos. Texto de apoio usa 0.9375rem em tabelas e legendas de seção.

### Named Rules
**The Tabular Numbers Rule.** Tabelas e horários usam algarismos tabulares para alinhar colunas.

**The Sentence-Case Rule.** Rótulos e botões em caixa de frase, sem caixa alta nem espaçamento de letras.

## Layout

Coluna central de até 64rem (`max-w-5xl`) com margem de 16px no celular e 32px a partir de md. Seções empilhadas com 48px de padding vertical, separadas por filete de 1px; em telas grandes a amostra usa duas colunas (14rem de legenda + conteúdo). A escala de espaço é de 4px, com os passos 8, 12, 16, 24, 32 e 48 mais usados. Formulários ficam em largura de leitura (`max-w-md`), blocos de texto em `max-w-prose`. Cabeçalho fixo no topo com filete inferior. O painel do psicólogo é uma tabela com rolagem horizontal contida; a conversa do paciente usa mensagens de até 85% da largura. Respeita `prefers-reduced-motion`.

## Elevation & Depth

Sistema plano, sem nenhuma sombra. A hierarquia vem de bordas de 1px (Fio Quente), de fundos tonais (Papel Quente, Superfície Clara, Areia Suave) e, no estado de risco, do fundo próprio da linha. O cabeçalho fixo usa fundo opaco quase total e filete, sem desfoque.

### Named Rules
**The No-Shadow Rule.** Nenhuma superfície projeta sombra, em repouso ou em hover. Foco usa anel e contorno, não brilho.

## Shapes

Dois raios declarados: 8px em controles e 12px em superfícies (`--radius-surface`). O preset do spartan calcula `rounded-md` como 0,8 × `--radius`, por isso `--radius` vale 0,625rem: é ele que entrega os 8px nos controles. Bordas de 1px; campos e botões outline com contorno mais firme que os divisores. Balões de conversa têm um canto menor no lado do remetente. Selos são retangulares arredondados, não pílulas.

Ponto a observar: o alerta usa `rounded-lg` e as bolhas `rounded-xl`, que não são os dois raios declarados. O raio de superfície de 12px existe como token, mas ainda só a amostra o usa; as telas reais devem usá-lo nas superfícies.

## Components

Sóbrios e sem ornamento: o componente some e a informação aparece.

### Buttons
- **Shape:** cantos de controle, altura de 44px (default), 36px em `sm`; peso 600, 16px.
- **Primary:** Verde-azulado Profundo com texto claro; hover a 80% de opacidade. Uma ação principal por tela.
- **Secondary:** Verde-azulado Suave. **Outline:** Superfície Clara com contorno de campo. **Ghost:** transparente, hover Areia Suave. **Destructive:** vermelho a 10% de fundo com texto vermelho. **Link:** texto de marca com sublinhado no hover.
- **Hover / Focus:** transição de cor; anel de foco de 3px a 50% de opacidade, mais deslocamento de 1px ao pressionar. Desabilitado a 50%.
- **Carregando:** ícone lucide girando mais rótulo de progresso ("Enviando convite…") e `aria-busy`.

### Inputs / Fields
- **Style:** fundo Superfície Clara, contorno de campo, 44px de altura, texto de 16px. Rótulo sempre visível acima, ajuda abaixo.
- **Focus:** borda e anel na cor de foco.
- **Error:** borda e anel vermelhos, mensagem com ícone de octógono e texto que diz como corrigir.

### Status badges
Selos de 24px com ícone de 12px + rótulo semibold. Variantes: nenhum, atencao, risco, pendente (vazado), aprovado (marca suave). Sempre com ícone lucide: círculo-check, triângulo-alerta, octógono-alerta, relógio, selo-check.

### Tables (painel do psicólogo)
Cabeçalho em Tinta de Apoio, semibold 14px; células com 16px de padding horizontal e 12px vertical; filete entre linhas; hover Areia Suave a 50%. Linha de risco: fundo `status-risco-linha` e nome em semibold, além do selo. Ordenação por alerta, legenda (caption) obrigatória, botão da linha de risco em destaque primário e os demais em outline.

### Alerts, skeletons e estados vazios
Alerta com ícone, título e descrição que diz o que fazer e oferece ação ("Tentar de novo"). Skeletons para carregamento com `role="status"`. Estado vazio é texto curto que explica quando algo aparecerá, com uma ação.

### Conversa (componente de app do paciente)
Bolhas recebidas em Areia Suave, enviadas em Verde-azulado Profundo, até 85% da largura, 16px/12px de padding. Aviso fixo e discreto de que o psicólogo lê a conversa.

## Do's and Don'ts

### Do:
- **Do** usar o verde-azulado só em ação, foco e mensagem do próprio paciente.
- **Do** mostrar status sempre com ícone lucide, rótulo e cor.
- **Do** separar superfícies por borda de 1px e tom, sem sombra.
- **Do** manter alvos de toque de 44px em botões e campos.
- **Do** escrever erros que dizem como corrigir e estados vazios que dizem o que fazer.
- **Do** destacar a linha de risco com `status-risco-linha`, nome em semibold e selo.
- **Do** usar números tabulares em tabelas e horários.

### Don't:
- **Don't** usar vermelho ou âmbar fora de risco, atenção e erro.
- **Don't** comunicar status só por cor.
- **Don't** usar sombras, desfoque de fundo ou brilho.
- **Don't** introduzir um terceiro raio além de 8px e 12px.
- **Don't** colocar mais de uma ação principal por tela.
- **Don't** usar emoji ou glifos como ícones; só lucide via `ng-icon`.
