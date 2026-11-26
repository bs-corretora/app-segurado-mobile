# Changelog

Mudanças relevantes do app do segurado (PWA). Formato baseado em
[Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), versões em
[SemVer](https://semver.org/lang/pt-BR/). A versão 0.1.0 foi reconstruída a partir dos PRs
mesclados.

## [Não lançado]

## [0.1.0] - 2026-11-26

Primeira versão publicada: o app do segurado ligado à API, instalável como PWA e com o layout de
computador.

### Adicionado

- Telas ligadas à API: login, cadastro, esqueci a senha, Início, apólices (com o PDF), sinistros
  (abrir e acompanhar), cotações, assistência, indicações, notificações e dados da conta
  (#2, #4, #5, #6, #7, #8, #9).
- PWA instalável, com aviso de nova versão e faixa de sem internet.
- Assistente virtual de qualquer tela: botão flutuante no celular e no menu lateral do computador
  (#19, #33).
- Design system em `.specs/DESIGN.md`: paleta, escala de texto, espaçamentos e estados, com
  contraste de pelo menos 4.5:1 também no tema escuro (#31).
- Layout de computador a partir de 1024px: menu lateral, formulários em duas colunas e listas em
  duas colunas (#30).
- Validação por campo ao sair dele e ao enviar, com asterisco nos obrigatórios e o formato aceito
  na mensagem (#29).
- Caixa "Quero receber novidades e atualizações" no cadastro, desmarcada por padrão, enviando
  `aceita_marketing` (#32).
- Explicação dos termos de seguro na própria tela: vigência, prêmio, cobertura e franquia (#33).
- Fundação do repositório: TypeScript, ESLint, Prettier, Vitest, CI com lint, formatação, tipos,
  testes, build, Gitleaks e `npm audit`, Dependabot e o cliente da API tipado (#2, #3, #14).
- Testes do cliente da API, das rotas, dos hooks (`useApi`, `usePaginado`, `useEnvio`,
  `useOnline`) e da validação, com cobertura mínima de 80% de linhas em `src/api`, `src/hooks` e
  `src/utils` no CI (#14).

### Corrigido

- Assistente responde sem os asteriscos do Markdown (#19).
- Regras de estilo que sumiram na troca para o design system: selos com cor, cartões com o nome
  separado do selo e a barra de abas sem cobrir o fim das listas (#36).
