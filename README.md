# BS Seguros — App do Segurado

App do segurado da BS Seguros: PWA em React + Vite, ligado à API do repositório
[`app-segurado-api`](https://github.com/bs-corretora/app-segurado-api).

- **No ar:** https://app-segurado.onrender.com (deploy automático a cada merge na `main`)
- **API:** https://app-segurado-api.onrender.com/api/v1 · Swagger em `/api/docs`
- **Como ligar as telas na API:** [docs/integracao-api.md](docs/integracao-api.md)
- **Como contribuir (fluxo, commits, CI):** [CONTRIBUTING.md](CONTRIBUTING.md)

Paleta extraída do logo: índigo `#494A99` e azul-céu `#37A6DE` (com modo escuro automático).

Todas as telas estão ligadas na API. O app é um **PWA**: dá para instalar na tela inicial do
celular (Android: botão "Instalar o app" em Configurações ou o aviso do Chrome; iPhone: no Safari,
Compartilhar → Adicionar à Tela de Início) e ele abre mesmo sem internet.

## Como rodar

Node 22 ou superior.

```bash
npm install
npm run dev          # http://localhost:5173, já liberado no CORS da API
npm run lint         # ESLint
npm run format       # Prettier (arruma a formatação)
npm run typecheck    # TypeScript
npm test             # testes unitários (Vitest) + teste de fumaça de todas as telas
npm run test:cobertura  # unitários com o relatório de cobertura (mínimo de 80% em api, hooks e utils)
npm run build        # tsc + build de produção em dist/
```

Para apontar para uma API local, crie `.env.local` com
`VITE_API_URL=http://localhost:3000/api/v1`.

## Estrutura

| Caminho             | O que tem                                                                                                                                     |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/api/`          | cliente da API, tipos das respostas e uma função por rota                                                                                     |
| `src/app/`          | `App.tsx`, `main.tsx`, `nav.tsx` (navegação por pilha: abas, telas internas e botão voltar) e `sessao.tsx` (resumo da pessoa logada)          |
| `src/screens/`      | uma tela por arquivo, por assunto: `auth/`, `inicio/`, `apolices/`, `sinistros/`, `cotacoes/`, `conta/`; `index.ts` liga cada rota à sua tela |
| `src/components/`   | um componente por arquivo (Card, Campo, Selecao, Aviso, ComDados, Contato, CartaoApolice…) e o `index.ts` que reexporta                       |
| `src/constants/`    | `rotulos.ts`: texto de cada código da API (status, produto, tipo de sinistro…)                                                                |
| `src/utils/`        | `formatos.ts` (datas, moeda, máscaras de CPF e telefone, mensagens de erro) e `rotuloApolice.ts`                                              |
| `src/hooks/`        | `useApi`/`usePaginado` (carregando, erro, vazio) e `useEnvio` (formulários)                                                                   |
| `src/pwa/`          | instalação na tela inicial e aviso de versão nova                                                                                             |
| `pwa/`              | modelo do service worker e o plugin do Vite que gera o `/sw.js` no build                                                                      |
| `public/`           | manifesto e ícones do PWA                                                                                                                     |
| `src/styles.css`    | tokens de cor e estilos                                                                                                                       |
| `tests/`            | testes unitários (Vitest): cliente da API, formatos, navegação e PWA                                                                          |
| `scripts/smoke.mjs` | teste de fumaça: renderiza todas as telas                                                                                                     |

## PWA

- **Service worker** (`pwa/sw.js`): guarda só o app (HTML, JS, CSS, ícones) para abrir rápido e
  sem internet. **Nada da API nem os PDFs** passam pelo cache: dado do segurado sempre vem da rede.
- **Versão nova:** cada build gera um `/sw.js` com a lista exata dos arquivos e uma versão nova.
  Quem está com o app aberto vê a faixa "Nova versão do app disponível" e escolhe quando atualizar.
- **Só no build:** no `npm run dev` o service worker não é registrado. Para testar o PWA:
  `npm run build && npx vite preview --port 5173`.
- **Sem push com o app fechado** (o envio da API é do Expo). O sininho usa `nao_lidas` do
  dashboard e se atualiza quando a pessoa volta ao app.
- **Ícones** em `public/icons/`, gerados a partir do "B" do logo.

## Qualidade

Todo PR passa por lint, formatação, TypeScript, testes, build em Linux, Gitleaks e `npm audit`
(ver [CONTRIBUTING.md](CONTRIBUTING.md)). A `main` é protegida: só entra por PR com o CI verde.

## Pendências de confirmação com a BS Seguros

- Tipos de cobertura por produto (a spec não lista).
- Campos do formulário de cotação por produto.
- Tela de termos de uso (o cadastro pede o aceite, mas ainda não há texto para linkar).
- Ícones do PWA em alta resolução: os de `public/icons/` foram ampliados do logo de 540 px; um
  SVG ou PNG grande do "B" deixa o ícone mais nítido.
