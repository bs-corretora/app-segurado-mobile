# App do Segurado — mobile

Aplicativo mobile do App do Segurado (BS Seguros), em React Native.

> Projeto em construção. Esta página descreve a estrutura combinada; os comandos de execução
> passam a valer à medida que o código for entrando.

## Stack

| Camada | Tecnologia |
|---|---|
| Linguagem | TypeScript |
| App | React Native com Expo |
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

## Fluxo de trabalho

- Cada pessoa trabalha em uma branch própria e abre Pull Request para a `main`.
