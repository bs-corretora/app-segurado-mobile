---
name: BS Seguros - Design System
version: 1.0.0
description: Sistema de design formal para o app do segurado BS Seguros (PWA Mobile + Desktop)
basedOn: 'Insurtech Modern Light (Google Stitch)'
breakpointDesktop: 1024px
---

# BS Seguros - Design System (`.specs/DESIGN.md`)

> Documentação formal do sistema visual do aplicativo BS Seguros. Baseado na paleta **Insurtech Modern Light** do Google Stitch, adaptado para React/TypeScript PWA com suporte Mobile (< 1024px) e Desktop (≥ 1024px).

---

## 1. Paleta de Cores (Tokens)

### 1.1 Cores Primárias e de Marca

| Token     | Light     | Dark      | Uso                                                               |
| --------- | --------- | --------- | ----------------------------------------------------------------- |
| `--pri`   | `#00142f` | `#adc6ff` | Cor principal da marca (headers, textos fortes, botões primários) |
| `--pri-d` | `#0f294a` | `#4d8eff` | Variação escura da primária (hover, containers)                   |
| `--sec`   | `#1d4ed8` | `#3b82f6` | Ação secundária / links / ícones interativos                      |
| `--sec-l` | `#d5e3ff` | `#1e293b` | Background de ações secundárias / chips                           |

### 1.2 Superfícies e Background

| Token                 | Light     | Dark      | Uso                                     |
| --------------------- | --------- | --------- | --------------------------------------- |
| `--bg`                | `#f7f9fb` | `#0b1326` | Background principal da página          |
| `--card`              | `#ffffff` | `#182234` | Background de cards, containers, modais |
| `--surface`           | `#f2f4f6` | `#131b2e` | Superfícies elevadas (level 1)          |
| `--surface-container` | `#eceef0` | `#171f33` | Containers internos                     |

### 1.3 Textos

| Token        | Light     | Dark      | Uso                                        |
| ------------ | --------- | --------- | ------------------------------------------ |
| `--tx`       | `#191c1e` | `#dae2fd` | Texto principal (headlines, body)          |
| `--tx2`      | `#44474e` | `#94a3b8` | Texto secundário (labels, hints, metadata) |
| `--tx-muted` | `#64748b` | `#64748b` | Texto desabilitado / placeholder           |

### 1.4 Bordas e Divisores

| Token         | Light     | Dark      | Uso                                       |
| ------------- | --------- | --------- | ----------------------------------------- |
| `--bd`        | `#e2e8f0` | `#334155` | Bordas padrão de cards, inputs, divisores |
| `--bd-strong` | `#c4c6cf` | `#424754` | Bordas de foco / erro / estados ativos    |

### 1.5 Status Semânticos (Contraste ≥ 4.5:1 validado)

| Status                 | Light (bg/text/border)            | Dark (bg/text/border)                                        | Uso                                  |
| ---------------------- | --------------------------------- | ------------------------------------------------------------ | ------------------------------------ |
| **Sucesso / Ativo**    | `#ecfdf5` / `#047857` / `#a7f3d0` | `rgba(16,185,129,0.15)` / `#10b981` / `rgba(16,185,129,0.3)` | Apólice ativa, confirmações          |
| **Atenção / Pendente** | `#fffbeb` / `#b45309` / `#fde68a` | `rgba(245,158,11,0.15)` / `#f59e0b` / `rgba(245,158,11,0.3)` | Renovação, cotação pendente          |
| **Erro / Crítico**     | `#fef2f2` / `#ba1a1a` / `#fecaca` | `rgba(239,68,68,0.15)` / `#ef4444` / `rgba(239,68,68,0.3)`   | Erros de validação, sinistro urgente |
| **Info / Neutro**      | `#eff6ff` / `#1d4ed8` / `#bfdbfe` | `rgba(59,130,246,0.15)` / `#3b82f6` / `rgba(59,130,246,0.3)` | Informações gerais, assistência      |

### 1.6 Links e Interativos

| Token  | Light     | Dark      |
| ------ | --------- | --------- |
| `--lk` | `#1d4ed8` | `#3b82f6` |

---

## 2. Tipografia

### 2.1 Fontes

- **Headlines / Títulos:** `Plus Jakarta Sans` (weights 600, 700)
- **Body / UI / Formulários:** `Inter` (weights 400, 500, 600)

### 2.2 Escala Tipográfica (Mobile base, Desktop +1 step opcional)

| Token         | Font              | Size (Mobile) | Size (Desktop) | Weight | Line Height | Letter Spacing | Uso                       |
| ------------- | ----------------- | ------------- | -------------- | ------ | ----------- | -------------- | ------------------------- |
| `headline-xl` | Plus Jakarta Sans | 32px          | 36px           | 700    | 40px        | -0.02em        | Título de página / Hero   |
| `headline-lg` | Plus Jakarta Sans | 24px          | 28px           | 700    | 32px        | -0.01em        | Seção principal           |
| `headline-md` | Plus Jakarta Sans | 20px          | 22px           | 600    | 28px        | -0.01em        | Card title                |
| `title-md`    | Plus Jakarta Sans | 16px          | 17px           | 600    | 24px        | +0.01em        | Botões, labels fortes     |
| `body-lg`     | Inter             | 16px          | 16px           | 400    | 24px        | 0              | Body padrão, parágrafos   |
| `body-md`     | Inter             | 15px          | 15px           | 400    | 22px        | 0              | Body compacto, descrições |
| `body-sm`     | Inter             | 14px          | 14px           | 400    | 20px        | 0              | Metadata, hints           |
| `label-md`    | Inter             | 13px          | 13px           | 600    | 18px        | +0.01em        | Labels de input, badges   |
| `label-sm`    | Inter             | 12px          | 12px           | 600    | 16px        | +0.02em        | Micro-labels, pills       |
| `caption`     | Inter             | 11px          | 11px           | 500    | 14px        | +0.03em        | Timestamps, contadores    |

> **Regra:** Todo texto de leitura (body, parágrafos, labels, descrições) **≥ 15px**. Títulos e textos de botões **font-weight ≥ 600**.

---

## 3. Espaçamentos, Raios e Elevações

### 3.1 Espaçamentos (base 4px = 0.25rem)

| Token      | Valor         | Uso                                    |
| ---------- | ------------- | -------------------------------------- |
| `space-xs` | 4px (0.25rem) | Gap micro entre elementos inline       |
| `space-sm` | 8px (0.5rem)  | Gap pequeno (icon + label)             |
| `space-md` | 16px (1rem)   | Padding padrão cards, gap entre campos |
| `space-lg` | 24px (1.5rem) | Gap entre seções, padding container    |
| `space-xl` | 32px (2rem)   | Padding hero, margens grandes          |

### 3.2 Raios de Borda

| Token          | Valor          | Uso                            |
| -------------- | -------------- | ------------------------------ |
| `rounded-sm`   | 4px (0.25rem)  | Badges, chips, pequenos        |
| `rounded`      | 8px (0.5rem)   | Inputs, botões, tags           |
| `rounded-md`   | 12px (0.75rem) | Cards padrão, containers       |
| `rounded-lg`   | 16px (1rem)    | Cards elevados, modais, sheets |
| `rounded-xl`   | 24px (1.5rem)  | Hero, banners                  |
| `rounded-full` | 9999px         | Pills, badges de status, FAB   |

### 3.3 Elevação (Sombras)

| Level         | Light                                                                      | Dark                                                                        | Uso                     |
| ------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------- |
| 0 (Canvas)    | none                                                                       | none                                                                        | Page root               |
| 1 (Card)      | `0 1px 3px 0 rgba(15,41,74,0.04), 0 1px 2px -1px rgba(15,41,74,0.03)`      | `1px solid #334155`                                                         | Cards padrão            |
| 2 (Elevado)   | `0 10px 15px -3px rgba(15,41,74,0.08), 0 4px 6px -4px rgba(15,41,74,0.04)` | `0 8px 24px -6px rgba(11,17,30,0.7) + inset 0 1px 0 rgba(255,255,255,0.05)` | Hover cards, sheets     |
| 3 (Flutuante) | `0 -4px 16px -2px rgba(15,41,74,0.06)` + backdrop blur                     | `0 20px 40px -10px rgba(0,0,0,0.8)` + backdrop blur                         | Bottom nav, modais, FAB |

---

## 4. Estados dos Componentes

### 4.1 Campo (Input, Select, Textarea, Checkbox) — `Campo.tsx`, `Selecao.tsx`, `AreaTexto.tsx`, `Caixa.tsx`

| Estado           | Visual (Light)                                  | Visual (Dark)                                   | CSS                                         |
| ---------------- | ----------------------------------------------- | ----------------------------------------------- | ------------------------------------------- |
| **Padrão**       | Border `--bd`, bg `--card`, text `--tx`         | Border `--bd`, bg `--card`, text `--tx`         | `.f`                                        |
| **Hover**        | Border `--bd-strong`                            | Border `--bd-strong`                            | `.f:hover` (desktop)                        |
| **Foco**         | Border `--sec` (2px), outline-offset 2px        | Border `--sec` (2px), outline-offset 2px        | `input:focus, select:focus, textarea:focus` |
| **Preenchido**   | Igual padrão                                    | Igual padrão                                    | —                                           |
| **Erro**         | Border `--err`, msg `--err` (13px) abaixo       | Border `--err`, msg `--err` abaixo              | `.f.inv` + `.msg`                           |
| **Desabilitado** | Opacity 0.5, cursor not-allowed, bg `--surface` | Opacity 0.5, cursor not-allowed, bg `--surface` | `input:disabled`                            |
| **Carregando**   | Spinner no botão de submit associado            | Igual                                           | `.btn[aria-busy="true"]`                    |

### 4.2 Botão — `Botao.tsx`

| Variante               | Padrão                                            | Hover          | Foco            | Carregando                     | Desabilitado |
| ---------------------- | ------------------------------------------------- | -------------- | --------------- | ------------------------------ | ------------ |
| **Primário** (`pri`)   | bg `--pri`, text `#fff`                           | bg `--pri-d`   | Outline `--sec` | Spinner branco, bg `--pri` 0.8 | Opacity 0.7  |
| **Secundário** (`sec`) | bg `--sec-l`, text `--lk`                         | bg `--sec` 0.9 | Outline `--sec` | Spinner `--lk`, bg `--sec-l`   | Opacity 0.7  |
| **Outline** (`out`)    | bg transparent, border 1.5px `--pri`, text `--lk` | bg `--sec-l`   | Outline `--sec` | Spinner `--lk`                 | Opacity 0.7  |

> **Regra:** Altura mínima 48px (touch target). Font-weight 600. Border-radius 12px. Transições 150ms.

### 4.3 Cards e Containers

| Estado                | Visual                                                                                       |
| --------------------- | -------------------------------------------------------------------------------------------- |
| **Padrão**            | bg `--card`, border 1px `--bd`, radius 14px, shadow level 1                                  |
| **Hover** (desktop)   | shadow level 2, border `--sec`                                                               |
| **Selecionado/Ativo** | border `--sec`, shadow level 1                                                               |
| **Vazio** (`empty`)   | bg `--card`, border 1px dashed `--bd`, radius 14px, padding 24px, texto centralizado `--tx2` |
| **Erro** (container)  | border `--err`, bg `--err` 0.05                                                              |
| **Carregando**        | Skeleton shimmer (bg `--surface-container` → `--surface` animation 1.5s)                     |

### 4.4 Badges / Status Pills (`.tag`, `.status-pill`)

| Estado      | Visual                                                                             |
| ----------- | ---------------------------------------------------------------------------------- |
| **Padrão**  | Radius full, padding 4px 10px, font-size 12px, weight 600, border 1px currentColor |
| **Sucesso** | bg `#ecfdf5`, text `#047857`, border `#a7f3d0`                                     |
| **Atenção** | bg `#fffbeb`, text `#b45309`, border `#fde68a`                                     |
| **Erro**    | bg `#fef2f2`, text `#ba1a1a`, border `#fecaca`                                     |
| **Info**    | bg `#eff6ff`, text `#1d4ed8`, border `#bfdbfe`                                     |

---

## 5. Estrutura de Telas (Frames de Referência)

### 5.1 Mobile (< 1024px) — Bottom Tab Bar

| Tela              | Layout                                | Componentes-chave                                                  |
| ----------------- | ------------------------------------- | ------------------------------------------------------------------ |
| **Início**        | Coluna única, padding 16px, gap 14px  | Hero card, Apólices (grid 1 col), Acesso rápido (grid 3 col), CTAs |
| **Apólices**      | Lista vertical, cards `CartaoApolice` | Card apólice com status pill, vencimento, valor                    |
| **Sinistro**      | Lista + FAB nova                      | Lista `tl` (timeline), FAB abrir sinistro                          |
| **Cotação**       | Form grid 1 col + cards propostas     | Seleção produto/cobertura, telefone, detalhes                      |
| **Assistente**    | Chat fixed bottom                     | Balões, sugestões, input fixed                                     |
| **Cadastro**      | Form grid 1 col, max-width 100%       | 7 campos + checkbox termos + marketing opt-in                      |
| **Configurações** | Lista navegação + perfil              | Cards navegação, logout                                            |

### 5.2 Desktop (≥ 1024px) — Sidebar Fixa (260px)

| Tela              | Layout                                   | Grid/Colunas                                        |
| ----------------- | ---------------------------------------- | --------------------------------------------------- |
| **Início**        | Sidebar + Main (max 1200px, margem auto) | KPIs 4 col, Apólices 3 col, Acesso rápido 3 col     |
| **Apólices**      | Sidebar + Grid responsivo                | `grid-responsive` (3-4 col)                         |
| **Sinistro**      | Sidebar + Form 2 col (800px max)         | `form-grid` 2 col + full-width textarea             |
| **Cotação**       | Sidebar + Form 2 col                     | `form-grid` 2 col + full-width textarea             |
| **Assistente**    | Sidebar + Chat (800px max)               | Coluna única centralizada                           |
| **Cadastro**      | Sidebar + Form 2 col (840px max)         | `form-grid` 2 col (nome+cpf, email+cel, data+senha) |
| **Configurações** | Sidebar + Perfil/Dados 2 col             | Perfil lateral + formulários centralizados          |

---

## 6. Mapeamento de Toques (Eficiência de Fluxo - Issue 3)

### 6.1 Antes (referência)

| Tarefa              | Toques a partir do Início                   |
| ------------------- | ------------------------------------------- |
| Ver apólice         | 2 (Início → card apólice)                   |
| Ver vencimento      | 2 (visível no card do Início)               |
| Abrir sinistro      | 2 (Início → atalho "Sinistro" → formulário) |
| Acompanhar sinistro | 2 (Início → aba "Sinistro")                 |
| Pedir assistência   | 2 (Início → atalho "Assistência 24h")       |

### 6.2 Depois (garantido ≤ 2 toques)

| Tarefa                     | Mobile             | Desktop             | Caminho                                             |
| -------------------------- | ------------------ | ------------------- | --------------------------------------------------- |
| **1. Ver apólice**         | 1 toque no card    | 1 clique no card    | `CartaoApolice` no Início → `Apolice`               |
| **2. Saber vencimento**    | 0 toques (visível) | 0 cliques (visível) | Exibido no card `CartaoApolice` (badge + metadata)  |
| **3. Abrir sinistro**      | 1 toque no atalho  | 1 clique no atalho  | Início → `SinNovo` (atalho grid-3col + sidebar)     |
| **4. Acompanhar sinistro** | 1 toque na aba     | 1 clique na sidebar | TabBar `sinistro` / Sidebar `sinistro` → `Sinistro` |
| **5. Pedir assistência**   | 1 toque no atalho  | 1 clique no atalho  | Início → `Assistente` (atalho + sidebar)            |

> **Assistente Global:** FAB flutuante (mobile) / botão header (desktop) acessível de **qualquer tela** → abre `Assistente` em 1 toque/clique.

---

## 7. Glossário Inline de Termos de Seguro (Issue 3.3)

Termos com explicação inline (texto auxiliar discreto 13px `--tx2` ou tooltip acessível):

| Termo               | Contexto                   | Explicação Sugerida                                                                                                                |
| ------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Franquia**        | Apólice Auto, Sinistro     | "Valor que você paga em cada sinistro com perda parcial. Ex.: franquia de R$ 1.000 = você paga os primeiros R$ 1.000 do conserto." |
| **Vigência**        | Apólice, Cotação           | "Período em que o seguro está ativo. Início e fim das coberturas."                                                                 |
| **Cobertura**       | Cotação, Apólice, Sinistro | "O que o seguro protege. Ex.: Colisão, Roubo, Incêndio, Danos a terceiros."                                                        |
| **Prêmio**          | Cotação, Apólice           | "Valor que você paga pelo seguro (mensal ou anual)."                                                                               |
| **Sinistro**        | Sinistro, Assistência      | "Evento coberto pelo seguro (colisão, roubo, incêndio, etc.) que gera pedido de indenização."                                      |
| **Assistência 24h** | Início, Assistente         | "Serviços de emergência: guincho, chaveiro, troca de pneu, socorro mecânico."                                                      |

---

## 8. Acessibilidade (WCAG 2.1 AA)

- **Contraste:** Todos os pares texto/fundo validados ≥ 4.5:1 (ver seção 1.5)
- **Foco visível:** Outline 2px `--sec` + offset 2px em todos os interativos
- **Touch targets:** Mínimo 44×44px (botões 48px, FAB 56px)
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` desativa animações > 100ms
- **ARIA:** Labels, `aria-invalid`, `aria-describedby`, `aria-required`, `aria-busy`, `aria-current` implementados
- **Ordem de foco:** Lógica (header → main → sidebar/tabbar)
- **Escala de fonte:** Respeita zoom do navegador até 200%

---

## 9. Animações e Transições

| Elemento            | Duração      | Easing                       | Reduced Motion           |
| ------------------- | ------------ | ---------------------------- | ------------------------ |
| Botão hover/active  | 150ms        | ease-out                     | Desativado (instantâneo) |
| Card hover          | 200ms        | ease-out                     | Desativado               |
| TabBar/Sidebar item | 150ms        | ease-out                     | Desativado               |
| Modal/Sheet entrada | 200ms        | ease-out                     | 50ms                     |
| Spinner             | 800ms linear | linear                       | 2.4s                     |
| Shimmer skeleton    | 1.5s         | ease-in-out                  | Desativado (bg estático) |
| FAB entrada         | 200ms        | cubic-bezier(0.4, 0, 0.2, 1) | Desativado               |

> **Regra:** Nenhuma animação/transição > 300ms. Todas com `@media (prefers-reduced-motion: reduce)`.

---

## 10. Componentes Base - Referência Rápida

| Componente  | Arquivo                        | Props-chave                                                                                  | Estados cobertos                                        |
| ----------- | ------------------------------ | -------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `Campo`     | `src/components/Campo.tsx`     | `label`, `value`, `onChange`, `onBlur`, `erro`, `required`, `validar`, `className`           | padrão, foco, erro, desabilitado, carregando (via form) |
| `AreaTexto` | `src/components/AreaTexto.tsx` | Igual `Campo` + `maxLength`                                                                  | Igual                                                   |
| `Selecao`   | `src/components/Selecao.tsx`   | `label`, `value`, `onChange`, `onBlur`, `opcoes`, `erro`, `required`, `validar`, `className` | Igual                                                   |
| `Caixa`     | `src/components/Caixa.tsx`     | `checked`, `onChange`, `onBlur`, `erro`, `required`, `validar`, `children`, `className`      | Igual                                                   |
| `Botao`     | `src/components/Botao.tsx`     | `children`, `variante`, `carregando`, `type`, `onClick`, `disabled`, `className`             | pri/sec/out, hover, foco, carregando, desabilitado      |
| `Icon`      | `src/components/Icone.tsx`     | `n` (NomeIcone), `className`                                                                 | —                                                       |

---

## 11. Checklist de Validação por Tela

- [ ] Tipografia body ≥ 15px, botões weight ≥ 600
- [ ] Contraste ≥ 4.5:1 em todos os estados
- [ ] Foco visível (outline 2px `--sec`)
- [ ] Touch targets ≥ 44px
- [ ] Estados: padrão, hover, foco, erro, desabilitado, carregando, vazio
- [ ] Reduced motion respeitado
- [ ] ARIA labels completos
- [ ] Grid responsivo funcionando (1→2→3→4 col)
- [ ] Form grid 2 colunas no desktop (≥ 1024px)
- [ ] Toques ≤ 2 a partir do Início para 5 tarefas principais
- [ ] Assistente acessível globalmente
- [ ] Glossário inline nos termos técnicos
- [ ] `aceita_marketing` opt-in no cadastro + configurações

---

_Documento vivo — atualizar a cada mudança no design system._
