# BS Seguros — App do Segurado

App do segurado da BS Seguros: PWA em React + Vite, ligado à API do repositório
[`app-segurado-api`](https://github.com/bs-corretora/app-segurado-api).

- **No ar:** https://app-segurado.onrender.com (deploy automático a cada merge na `main`)
- **API:** https://app-segurado-api.onrender.com/api/v1 · Swagger em `/api/docs`
- **Como ligar as telas na API:** [docs/integracao-api.md](docs/integracao-api.md)
- **Como contribuir (fluxo, commits, CI):** [CONTRIBUTING.md](CONTRIBUTING.md)

Paleta extraída do logo: índigo `#494A99` e azul-céu `#37A6DE` (com modo escuro automático).

> As telas ainda mostram dados de exemplo (`src/data.js`) enquanto a integração das issues
> #3 a #9 não termina.

## Como rodar

Node 22 ou superior.

```bash
npm install
npm run dev          # http://localhost:5173, já liberado no CORS da API
npm run lint         # ESLint
npm run format       # Prettier (arruma a formatação)
npm run typecheck    # TypeScript
npm test             # testes unitários (Vitest) + teste de fumaça de todas as telas
npm run build        # tsc + build de produção em dist/
```

Para apontar para uma API local, crie `.env.local` com
`VITE_API_URL=http://localhost:3000/api/v1`.

## Estrutura

| Caminho             | O que tem                                                        |
| ------------------- | ---------------------------------------------------------------- |
| `src/api/`          | cliente da API, tipos das respostas e uma função por rota        |
| `src/nav.jsx`       | navegação por pilha (abas e telas internas)                      |
| `src/screens/`      | telas: Auth, Home, Policies, Claims, Quotes, More                |
| `src/ui.jsx`        | ícones e componentes (Card, Field, Select, Tag, Contact…)        |
| `src/data.js`       | rótulos, status e dados de exemplo (estes saem com a integração) |
| `src/styles.css`    | tokens de cor e estilos                                          |
| `tests/`            | testes unitários (Vitest)                                        |
| `scripts/smoke.mjs` | teste de fumaça: renderiza todas as telas                        |

A reorganização em pastas por assunto e a migração dos `.jsx` para TypeScript estão na issue #2.

## Qualidade

Todo PR passa por lint, formatação, TypeScript, testes, build em Linux, Gitleaks e `npm audit`
(ver [CONTRIBUTING.md](CONTRIBUTING.md)). A `main` é protegida: só entra por PR com o CI verde.

## Pendências de confirmação com a BS Seguros

- Tipos de cobertura por produto (a spec não lista).
- Campos do formulário de cotação por produto.
- Tela de termos de uso (o cadastro pede o aceite).
