// Cliente da API: guarda os tokens, manda o Bearer, renova sozinho quando o token vence e avisa
// o app quando a sessão acaba. Mesmo comportamento do guia docs/integracao-api.md.
import type { CorpoErro, Tokens } from './tipos';

export const API_URL: string =
  import.meta.env.VITE_API_URL ?? 'https://app-segurado-api.onrender.com/api/v1';

const CHAVE_ACESSO = 'access_token';
const CHAVE_REFRESH = 'refresh_token';

export function guardarTokens(t: Pick<Tokens, 'access_token' | 'refresh_token'>): void {
  localStorage.setItem(CHAVE_ACESSO, t.access_token);
  localStorage.setItem(CHAVE_REFRESH, t.refresh_token);
}

export function limparTokens(): void {
  localStorage.removeItem(CHAVE_ACESSO);
  localStorage.removeItem(CHAVE_REFRESH);
}

export function temSessao(): boolean {
  return localStorage.getItem(CHAVE_ACESSO) !== null;
}

// O app registra aqui o que fazer quando a sessão acaba (ex.: ir para o login).
let aoSairDaSessao: () => void = () => {};
export function quandoSessaoAcabar(fn: () => void): void {
  aoSairDaSessao = fn;
}

export class ErroApi extends Error {
  readonly status: number;
  /** VALIDACAO, NAO_AUTENTICADO, CONFLITO... */
  readonly erro: string | undefined;
  /** Nos erros 400: `{ campo: 'mensagem' }`, para mostrar embaixo de cada campo. */
  readonly campos: Record<string, string>;

  constructor(status: number, corpo: Partial<CorpoErro> | null) {
    super(corpo?.mensagem ?? `Erro ${status}`);
    this.name = 'ErroApi';
    this.status = status;
    this.erro = corpo?.erro;
    this.campos = corpo?.campos ?? {};
  }
}

export type Metodo = 'GET' | 'POST' | 'PATCH' | 'DELETE';
export type Opcoes = { method?: Metodo; corpo?: unknown };

function enviar(caminho: string, { method = 'GET', corpo }: Opcoes = {}): Promise<Response> {
  const headers: Record<string, string> = {};
  const token = localStorage.getItem(CHAVE_ACESSO);
  if (token) headers.Authorization = `Bearer ${token}`;
  if (corpo !== undefined) headers['Content-Type'] = 'application/json';
  return fetch(API_URL + caminho, {
    method,
    headers,
    body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
  });
}

// Uma renovação por vez: o refresh_token só serve uma vez, e duas renovações em paralelo
// derrubariam a sessão. Quem recebe 401 enquanto uma renovação roda espera a mesma.
let renovando: Promise<boolean> | null = null;
function renovar(): Promise<boolean> {
  renovando ??= (async () => {
    const refresh_token = localStorage.getItem(CHAVE_REFRESH);
    if (!refresh_token) return false;
    const r = await fetch(API_URL + '/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token }),
    });
    if (!r.ok) return false;
    guardarTokens((await r.json()) as Tokens);
    return true;
  })()
    .catch(() => false)
    .finally(() => {
      renovando = null;
    });
  return renovando;
}

/**
 * Chama a API e devolve o corpo já tipado.
 * `await api<Dashboard>('/dashboard')`, `await api<SinistroCriado>('/sinistros', { method: 'POST', corpo })`.
 * Erro HTTP vira `ErroApi`. 204 devolve `null`.
 */
export async function api<T>(caminho: string, opcoes?: Opcoes): Promise<T> {
  const deAuth = caminho.startsWith('/auth/');
  let r = await enviar(caminho, opcoes);
  if (r.status === 401 && !deAuth && (await renovar())) {
    r = await enviar(caminho, opcoes);
  }
  if (r.status === 401 && !deAuth) {
    limparTokens();
    aoSairDaSessao();
  }
  if (r.status === 204) return null as T;
  const corpo: unknown = await r.json().catch(() => null);
  if (!r.ok) throw new ErroApi(r.status, corpo as Partial<CorpoErro> | null);
  return corpo as T;
}
