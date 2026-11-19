# BS Seguros — App do Segurado (protótipo React)

Protótipo de alta fidelidade do App do Segurado, feito como site mobile em React + Vite.
Todos os dados são fictícios. Paleta extraída do logo: índigo `#494A99` e azul-céu `#37A6DE` (com modo escuro automático).

## Como rodar
```bash
npm install
npm run dev      # desenvolvimento
npm run build    # gera dist/ para deploy (Netlify, Vercel, Render static...)
npm test         # renderiza todas as telas e falha se alguma quebrar
```

## Estrutura
- `src/app/` — App.tsx, main.tsx, nav.tsx, sessao.tsx (núcleo da aplicação)
- `src/components/` — componentes de UI reutilizáveis (Card, Campo, Seleção, Selo, Ícone, Contato, CartãoApolice…)
- `src/constants/` — rotulos.ts (títulos, status, ícones de abas)
- `src/utils/` — formatos.ts (helpers de formatação)
- `src/screens/` — telas organizadas por domínio:
  - `auth/` — Login, Esqueci, EsqueciOk, Cadastro, Boas
  - `inicio/` — Inicio (Home)
  - `apolices/` — Apolices, Apolice, Pdf
  - `sinistros/` — Assist, Sinistro, SinNovo, SinOk, SinDet
  - `cotacoes/` — Cotacao, CotProd, CotForm, CotDet
  - `conta/` — Indicar, Notif, Config, Perfil, Dados, Ajuda
- `src/styles.css` — tokens de cor e estilos

## Pendências de confirmação com a BS Seguros
- Tipos de cobertura por produto (a spec não lista).
- Campos do formulário de cotação por produto.
- Telefones e WhatsApp reais de assistência e sinistro.
- Telas ainda não incluídas: termos de uso, painel admin e página pública de indicação.
