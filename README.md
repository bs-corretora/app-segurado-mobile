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
- `src/nav.jsx` — navegação por pilha (abas e telas internas)
- `src/data.js` — dados fictícios, títulos, status e tipos de cobertura
- `src/ui.jsx` — ícones e componentes (Card, Field, Select, Tag, Contact…)
- `src/screens/` — Auth, Home, Policies, Claims, Quotes, More
- `src/styles.css` — tokens de cor e estilos

## Pendências de confirmação com a BS Seguros
- Tipos de cobertura por produto (a spec não lista).
- Campos do formulário de cotação por produto.
- Telefones e WhatsApp reais de assistência e sinistro.
- Telas ainda não incluídas: termos de uso, painel admin e página pública de indicação.
