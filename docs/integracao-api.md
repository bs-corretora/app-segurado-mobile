# Integração com a API

Como as telas do app falam com a API do App do Segurado. O cliente, os tipos e uma função por rota
ficam em `src/api/`, e **todas as telas já estão ligadas** (tabela da seção 6). Use este guia ao
criar uma tela nova ou mexer numa existente.

## 1. Endereços

| O quê                                                                    | Endereço                                       |
| ------------------------------------------------------------------------ | ---------------------------------------------- |
| App publicado (deploy automático a cada merge na `main`)                 | https://app-segurado.onrender.com              |
| API                                                                      | `https://app-segurado-api.onrender.com/api/v1` |
| Swagger (todas as rotas, com exemplo e botão de testar)                  | https://app-segurado-api.onrender.com/api/docs |
| Painel do admin (para ver o outro lado: mudar status, responder cotação) | https://app-segurado-api.onrender.com/admin    |

O Render gratuito dorme sem uso. Se a primeira chamada levar 30 a 60 segundos, é isso: espere.

**CORS:** já liberados `https://app-segurado.onrender.com` e `http://localhost:5173` (o
`npm run dev`). O `vite preview` usa a porta 4173, que não está liberada: rode
`npx vite preview --port 5173`.

**Usuários de teste** (senha `Senha@123`):

| E-mail                     | Para testar                                         |
| -------------------------- | --------------------------------------------------- |
| `maria.souza@email.com`    | 3 apólices, sinistro em análise, cotação respondida |
| `joao.silva@email.com`     | apólice vencida                                     |
| `ana.oliveira@email.com`   | apólice empresarial                                 |
| `carlos.pereira@email.com` | sinistro concluído                                  |
| `fernanda.costa@email.com` | cliente nova, sem histórico                         |
| `admin@bsseguros.com.br`   | só o painel do admin (não usar no app)              |

O banco é o mesmo para todo mundo. Para testar escrita à vontade, crie uma conta pelo cadastro.

## 2. O que já existe em `src/api/`

| Arquivo      | O que tem                                                                                                                                                               |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tipos.ts`   | o formato de cada resposta (`Dashboard`, `Apolice`, `Sinistro`, `Cotacao`, `Pagina<T>`...)                                                                              |
| `cliente.ts` | `api<T>()`: manda o Bearer, renova o token sozinho (uma vez só, mesmo com várias telas recebendo 401 juntas), avisa quando a sessão acaba, transforma erro em `ErroApi` |
| `index.ts`   | uma função por rota: `entrar`, `buscarDashboard`, `listarApolices`, `abrirSinistro`...                                                                                  |

Os testes de `tests/api/cliente.test.ts` provam o comportamento do cliente. Mudou a API? Atualize
`tipos.ts` e `index.ts` no mesmo PR.

## 3. Sessão

```tsx
import { useEffect } from 'react';
import { quandoSessaoAcabar, temSessao, buscarPerfil } from './api';

// Uma vez, num componente dentro do NavProvider (ex.: o Shell):
const { go } = useNav();
useEffect(() => quandoSessaoAcabar(() => go('login')), [go]);

// Ao abrir o app: com token guardado, confere se ainda vale.
if (temSessao()) {
  buscarPerfil()
    .then(() => go('home'))
    .catch(() => go('login'));
}
```

Os tokens ficam no `localStorage`. O `access_token` vale 1 hora; o cliente renova sozinho.
Não use `credentials: 'include'`: o app entra só pelo Bearer.

## 4. Padrão de uma tela

Toda tela que lê dado tem três estados: **carregando**, **erro** (com "tentar de novo") e
**vazio**. Exemplo:

```tsx
import { useEffect, useState } from 'react';
import { listarApolices, ErroApi, type ApoliceResumo } from '../api';

export function Apolices() {
  const [itens, setItens] = useState<ApoliceResumo[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let cancelado = false;
    setErro(null);
    listarApolices()
      .then((p) => !cancelado && setItens(p.itens))
      .catch((e) => !cancelado && setErro(e instanceof ErroApi ? e.message : 'Sem conexão.'));
    return () => {
      cancelado = true;
    };
  }, [tentativa]);

  if (erro) return <Erro mensagem={erro} aoTentar={() => setTentativa((n) => n + 1)} />;
  if (!itens) return <Carregando />;
  if (itens.length === 0) return <Vazio texto="Você ainda não tem apólices." />;
  return itens.map((a) => <CartaoApolice key={a.id} apolice={a} />);
}
```

Esse bloco já está pronto para reaproveitar:

- `useApi(() => buscarApolice(id), [id])` e `usePaginado(listarApolices)` (com "carregar mais"),
  em `src/hooks/useApi.ts`;
- `<ComDados r={r}>{(dados) => ...}</ComDados>`, em `src/components/ComDados.tsx`, mostra carregando e erro com
  "tentar de novo";
- `useEnvio()`, em `src/hooks/useEnvio.ts`, cuida de formulário: enviando, erro por campo (400) e
  erro geral, com as mensagens da API já traduzidas para a pessoa.

## 5. Formulários e erros

```tsx
try {
  await abrirSinistro({ apolice_id, tipo, data_ocorrencia: new Date(valor).toISOString() });
} catch (e) {
  if (e instanceof ErroApi) {
    setCampos(e.campos); // 400: mensagem embaixo de cada campo, ex.: campos.data_ocorrencia
    setErroGeral(e.message); // 409: regra de negócio, ex.: apólice vencida
  }
}
```

| Status | `erro.erro`       | O que fazer na tela                                                |
| ------ | ----------------- | ------------------------------------------------------------------ |
| 400    | `VALIDACAO`       | mostrar `erro.campos[nome]` embaixo de cada campo                  |
| 401    | `NAO_AUTENTICADO` | no login: "E-mail ou senha inválidos"; no resto o cliente já trata |
| 404    | `NAO_ENCONTRADO`  | registro não existe ou é de outra pessoa                           |
| 409    | `CONFLITO`        | mostrar `erro.message`                                             |
| 429    | `LIMITE_EXCEDIDO` | "muitas tentativas, espere um minuto"                              |
| 503    | `INDISPONIVEL`    | "serviço fora, tente de novo"                                      |

Campos que a API espera num formato que a tela mostra diferente:

| Campo                                  | Tela                 | API                                                       |
| -------------------------------------- | -------------------- | --------------------------------------------------------- |
| `data_nascimento`                      | DD/MM/AAAA           | `AAAA-MM-DD` (ou use `<input type="date">`)               |
| `data_ocorrencia`                      | data e hora          | ISO com fuso, não pode ser futura                         |
| `telefone`                             | (81) 99999-9999      | só dígitos, 10 ou 11                                      |
| `tipo` do sinistro                     | Colisão, Roubo...    | `COLISAO`, `ROUBO`, `INCENDIO`, `DANO_ELETRICO`, `OUTROS` |
| `produto`                              | Auto, Residencial... | `AUTO`, `RESIDENCIAL`, `VIDA`, `EMPRESARIAL`              |
| cotação: cobertura, telefone, detalhes | campos do formulário | dentro de `dados`, ex.: `{ cobertura: 'Incêndio' }`       |

## 6. Tela por tela

| Tela                                   | Função de `src/api`                                                    | Issue |
| -------------------------------------- | ---------------------------------------------------------------------- | ----- |
| Login, cadastro, esqueci a senha, sair | `entrar`, `cadastrar`, `pedirNovaSenha`, `sair`                        | #4    |
| Início e cabeçalho                     | `buscarDashboard`                                                      | #5    |
| Apólices, detalhe, PDF                 | `listarApolices`, `buscarApolice`, `linkPdfApolice`                    | #6    |
| Sinistros e assistência 24h            | `listarSinistros`, `buscarSinistro`, `abrirSinistro`, `listarContatos` | #7    |
| Cotações                               | `listarCotacoes`, `buscarCotacao`, `pedirCotacao`                      | #8    |
| Notificações                           | `listarNotificacoes`, `marcarNotificacaoLida`                          | #9    |
| Indicações                             | `buscarLinkIndicacao`, `listarIndicacoes`                              | #9    |
| Perfil, dados, senha                   | `buscarPerfil`, `atualizarPerfil`, `trocarSenha`                       | #9    |

Detalhes que mordem:

- **PDF:** o link vale 60 segundos. No iPhone, `window.open` depois de um `await` é bloqueado: use
  `window.location.href = url`.
- **Notificações:** não existe push com o app fechado no PWA (o envio da API é do Expo). O
  sininho usa `nao_lidas` do dashboard; atualize quando a pessoa volta ao app
  (`document.visibilityState === 'visible'`).
- **Esqueci a senha:** o e-mail leva para uma página da própria API. O app só pede o link.
- **`valor_estimado`** da cotação pode vir como texto: `Number(c.valor_estimado)`.
