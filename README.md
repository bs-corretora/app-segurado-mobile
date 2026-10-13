# App do Segurado — mobile

Aplicativo mobile do App do Segurado (BS Seguros), em React Native.

## Stack

| Camada | Tecnologia |
|---|---|
| Linguagem | TypeScript |
| App | React Native com Expo (SDK 57) |
| Navegação | Expo Router (rotas por arquivo) |
| Ícones | `@expo/vector-icons` (Feather) |
| Fonte | Inter (`@expo-google-fonts/inter`) |
| Notificação push | Expo Push Notifications |
| Back-end | API do repositório `app-segurado-api` |

## Regras de integração

- O app conversa somente com a API (`/api/v1`). Nenhuma chave do Supabase fica no app.
- A sessão é mantida em cookie HttpOnly emitido pela API; o app não guarda token.
- A URL da API vem de variável de ambiente (`EXPO_PUBLIC_API_URL`), ver `.env.example`.

## Como rodar (desenvolvimento)

Pré-requisitos: Node.js 22 e o app Expo Go no celular (ou um emulador).

```bash
cp .env.example .env
npm install
npx expo start
```

Antes de abrir um Pull Request, rode a checagem de tipos:

```bash
npm run typecheck
```

## Estrutura de pastas

```
src/
├── app/                  ← ROTAS (Expo Router). Cada arquivo aqui vira uma tela navegável.
│   ├── _layout.tsx       ← navegação raiz (pilha), carrega as fontes
│   ├── index.tsx         ← rota inicial, redireciona para o login
│   ├── login.tsx
│   ├── esqueci-senha.tsx
│   ├── criar-conta.tsx
│   ├── apolices.tsx
│   ├── notificacoes.tsx
│   ├── indicar-amigos.tsx
│   └── (abas)/           ← telas com a barra de abas inferior
│       ├── _layout.tsx   ← configuração da barra de abas
│       ├── inicio.tsx
│       ├── cotacao.tsx
│       ├── sinistro.tsx
│       ├── assistencia.tsx
│       └── configuracoes.tsx
│
├── telas/                ← CONTEÚDO de cada tela (uma pasta por tela)
│   ├── Login/TelaLogin.tsx
│   ├── Inicio/
│   │   ├── TelaInicio.tsx
│   │   └── componentes/  ← peças usadas só na tela Início
│   ├── Cotacao/TelaCotacao.tsx
│   └── ...
│
├── componentes/          ← componentes reutilizados em várias telas (Botao, CampoTexto, CartaoApolice...)
├── tema/                 ← cores, fontes e espaçamentos
├── servicos/             ← comunicação com a API (api.ts) e funções por assunto
├── tipos/                ← tipos TypeScript (Apolice, Segurado...)
├── dados/                ← dados falsos (mock) usados enquanto a API não está conectada
└── utilitarios/          ← funções auxiliares (formatar data, iniciais do nome...)
```

### Por que `app/` e `telas/` separados?

Os arquivos em `src/app/` só dizem **qual URL abre qual tela** e têm uma linha:

```tsx
// src/app/(abas)/inicio.tsx
export { default } from '@/telas/Inicio/TelaInicio';
```

O código da tela fica em `src/telas/`. Assim, quem procura uma tela vai direto em `telas/`,
e qualquer arquivo novo em `app/` vira uma rota (por isso não colocamos outras coisas lá).

## Convenções

- **Nomes em português**: pastas, arquivos, componentes, funções, variáveis e props
  (`aoPressionar`, `carregando`, `titulo`...).
- **Telas**: `src/telas/NomeDaTela/TelaNomeDaTela.tsx`, com `export default`.
- **Componentes**: PascalCase (`CartaoApolice.tsx`), com export nomeado.
  - Usado em uma tela só → `src/telas/NomeDaTela/componentes/`.
  - Usado em mais de uma tela → `src/componentes/`.
- **Rotas** (`src/app/`): letras minúsculas e hífen (`esqueci-senha.tsx`).
- **Cores, fontes e espaçamentos** vêm sempre de `@/tema`, nunca escritos direto no componente.
- **Imports** usam o atalho `@/` para a pasta `src/` (`import { Botao } from '@/componentes/Botao'`).
- **Dados**: as telas buscam dados pelos `servicos/`, nunca direto de `dados/mock.ts`.
  Quando a API estiver pronta, só os serviços mudam.
- **Pacotes novos**: instale com `npx expo install <pacote>` (escolhe a versão compatível com o Expo).

### Como criar uma tela nova

1. Crie `src/telas/MinhaTela/TelaMinhaTela.tsx` com `export default function TelaMinhaTela()`.
2. Crie a rota em `src/app/minha-tela.tsx` (ou em `src/app/(abas)/` se for uma aba):
   `export { default } from '@/telas/MinhaTela/TelaMinhaTela';`
3. Se a tela precisar de cabeçalho com botão de voltar, registre-a em `src/app/_layout.tsx`
   com `options={{ headerShown: true, title: '...' }}`.
4. Navegue até ela com `router.push('/minha-tela')` (importado de `expo-router`).

## Estado atual

| Tela | Situação |
|---|---|
| Login | Pronta (login simulado em `servicos/autenticacao.ts`) |
| Início | Pronta (dados falsos em `dados/mock.ts`) |
| Cotação, Sinistro, Assistência, Configurações | Em construção |
| Esqueci minha senha, Criar conta, Apólices, Notificações, Indique amigos | Em construção |

## Fluxo de trabalho

- Cada pessoa trabalha em uma branch própria e abre Pull Request para a `main`.
