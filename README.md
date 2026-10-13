# App do Segurado — mobile

Aplicativo mobile do App do Segurado (BS Seguros), em React Native com Expo.

## Sumário

- [Primeiros passos](#primeiros-passos)
- [Comandos do dia a dia](#comandos-do-dia-a-dia)
- [Problemas comuns](#problemas-comuns)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Convenções do projeto](#convenções-do-projeto)
- [Como criar uma tela nova](#como-criar-uma-tela-nova)
- [Integração com a API](#integração-com-a-api)
- [Estado atual](#estado-atual)
- [Fluxo de trabalho (Git)](#fluxo-de-trabalho-git)

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

## Primeiros passos

### 1. O que você precisa ter instalado

- **Node.js 22 ou superior** — confira com `node -v`.
- **Git**.
- **Expo Go** no celular (Android ou iPhone), baixado na loja de aplicativos.
  Alternativa: um emulador Android (Android Studio) ou simulador iOS (só em Mac).

### 2. Baixar e instalar

```bash
git clone <url-do-repositorio>
cd app-segurado-mobile
npm install
```

### 3. Configurar as variáveis de ambiente

Copie o arquivo de exemplo:

```bash
# Mac / Linux / Git Bash
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

Depois ajuste o `EXPO_PUBLIC_API_URL` se necessário (veja [Integração com a API](#integração-com-a-api)).
O arquivo `.env` **não vai para o Git**; só o `.env.example`.

> Por enquanto o app usa dados falsos e **não precisa da API no ar** para funcionar.

### 4. Rodar o app

```bash
npm start
```

Vai aparecer um QR code no terminal:

- **Celular:** abra o Expo Go e escaneie o QR code (Android: dentro do Expo Go; iPhone: pela câmera).
  O celular e o computador precisam estar **na mesma rede Wi-Fi**.
- **Emulador Android:** com o emulador aberto, aperte `a` no terminal.
- **Simulador iOS (Mac):** aperte `i` no terminal.

### 5. Testar o login

O login é simulado: **qualquer e-mail e senha preenchidos entram**. Depois de entrar você chega
na tela Início. Para sair, use o botão **Sair da conta** na aba Configurações.

## Comandos do dia a dia

| Comando | O que faz |
|---|---|
| `npm start` | Inicia o servidor de desenvolvimento (o mesmo que `npx expo start`) |
| `npm start -- --clear` | Inicia limpando o cache (use quando algo estranho acontecer) |
| `npm run typecheck` | Verifica erros de TypeScript — **rode antes de abrir um Pull Request** |
| `npx expo install <pacote>` | Instala uma biblioteca na versão compatível com o Expo |

> Instale pacotes sempre com `npx expo install`, e não com `npm install <pacote>`.
> Assim o Expo escolhe a versão que funciona com o SDK do projeto.

## Problemas comuns

**`npx start` dá erro "could not determine executable to run"**
O comando correto é `npm start` ou `npx expo start`.

**O QR code não abre no celular / fica carregando**
- Confirme que celular e computador estão na mesma rede Wi-Fi.
- Redes de empresa ou faculdade costumam bloquear a conexão. Tente `npm start -- --tunnel`
  (o Expo pede para instalar um pacote extra na primeira vez) ou use o hotspot do celular.
- O firewall do Windows pode bloquear o Node: permita o acesso quando ele perguntar.

**Erro depois de atualizar o código (`git pull`) ou trocar de branch**
```bash
npm install
npm start -- --clear
```

**Erro de tipo no VS Code sobre rotas (`href` não aceita a rota)**
As rotas tipadas são geradas quando o servidor roda. Rode `npm start` uma vez para atualizar.

**A fonte ou os ícones aparecem errados**
Pare o servidor e rode `npm start -- --clear`.

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
│   ├── Configuracoes/TelaConfiguracoes.tsx
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

### Onde mexer em cada tipo de tarefa

| Quero... | Vou em... |
|---|---|
| Mudar o visual ou o conteúdo de uma tela | `src/telas/<Tela>/` |
| Mudar uma cor, fonte ou espaçamento do app inteiro | `src/tema/` |
| Mudar um botão, campo ou cartão usado em várias telas | `src/componentes/` |
| Mudar as abas de baixo (ordem, nome, ícone) | `src/app/(abas)/_layout.tsx` |
| Mudar o título/cabeçalho de uma tela de pilha | `src/app/_layout.tsx` |
| Conectar algo à API | `src/servicos/` |

## Convenções do projeto

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
- **Telas ainda não feitas** usam o componente `TelaEmConstrucao`; ao implementar, troque o conteúdo.

## Como criar uma tela nova

1. Crie `src/telas/MinhaTela/TelaMinhaTela.tsx` com `export default function TelaMinhaTela()`.
2. Crie a rota em `src/app/minha-tela.tsx` (ou em `src/app/(abas)/` se for uma aba):
   ```tsx
   export { default } from '@/telas/MinhaTela/TelaMinhaTela';
   ```
3. Se a tela precisar de cabeçalho com botão de voltar, registre-a em `src/app/_layout.tsx`
   com `options={{ headerShown: true, title: '...' }}`.
4. Navegue até ela com `router.push('/minha-tela')` (importado de `expo-router`).
   O TypeScript avisa se a rota não existir.
5. Rode `npm run typecheck`.

## Integração com a API

- O app conversa somente com a API (`/api/v1`). Nenhuma chave do Supabase fica no app.
- A sessão é mantida em cookie HttpOnly emitido pela API; o app não guarda token.
- A URL da API vem da variável `EXPO_PUBLIC_API_URL` (ver `.env.example`).
  Todas as chamadas passam pelo cliente em `src/servicos/api.ts`.
- **Atenção ao testar no celular:** `localhost` no celular é o próprio celular, não o seu computador.
  Rodando a API na sua máquina, use o IP dela na rede, por exemplo
  `EXPO_PUBLIC_API_URL=http://192.168.0.10:3000/api/v1`. No emulador Android, o endereço do
  computador é `10.0.2.2`.
- Depois de mudar o `.env`, reinicie com `npm start -- --clear`.
- Hoje `servicos/autenticacao.ts` e `servicos/segurado.ts` ainda devolvem dados falsos
  (marcados com `TODO`). Ao ligar na API, troque apenas esses arquivos.

## Estado atual

| Tela | Situação |
|---|---|
| Login | Pronta (login simulado) |
| Início | Pronta (dados falsos em `dados/mock.ts`) |
| Configurações | Só o botão "Sair da conta" (logout simulado) |
| Cotação, Sinistro, Assistência | Em construção |
| Esqueci minha senha, Criar conta, Apólices, Notificações, Indique amigos | Em construção |

Pendências conhecidas: logo oficial (hoje é um espaço reservado em `componentes/Logo.tsx`),
integração real com a API e proteção das telas para usuário não logado.

## Fluxo de trabalho (Git)

- Cada pessoa trabalha em uma branch própria e abre Pull Request para a `main`.
- Antes de abrir o PR: `npm run typecheck` sem erros e o app abrindo sem avisos vermelhos.
- Não faça commit de `.env`, `node_modules/`, `.expo/` nem das pastas `ios/` e `android/`
  (já estão no `.gitignore`).
