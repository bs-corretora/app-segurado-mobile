// Uma função por rota que o app usa, já tipada. As telas importam daqui:
//   import { entrar, buscarDashboard, ErroApi } from '../api';
import { api, guardarTokens, limparTokens } from './cliente';
import type {
  Apolice,
  ApoliceResumo,
  AtualizarPerfil,
  Contato,
  Cotacao,
  Dashboard,
  Id,
  Indicacao,
  LinkIndicacao,
  LinkPdf,
  MensagemAssistente,
  NovaCotacao,
  NovoCadastro,
  NovoSinistro,
  Notificacao,
  Pagina,
  Perfil,
  RespostaAssistente,
  RespostaCadastro,
  RespostaLogin,
  Sinistro,
  SinistroCriado,
  SinistroResumo,
  TipoContato,
} from './tipos';

export { ErroApi, quandoSessaoAcabar, temSessao, API_URL } from './cliente';
export type * from './tipos';

type Paginacao = { pagina?: number; limite?: number };

function consulta(params: Record<string, string | number | boolean | undefined>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined) q.set(k, String(v));
  const s = q.toString();
  return s ? `?${s}` : '';
}

// ----- Autenticação ----------------------------------------------------------

export async function entrar(email: string, senha: string): Promise<RespostaLogin> {
  const r = await api<RespostaLogin>('/auth/login', { method: 'POST', corpo: { email, senha } });
  guardarTokens(r);
  return r;
}

/** 201 sem sessão: a pessoa precisa confirmar o e-mail com o código enviado por e-mail (`confirmarEmail`). */
export const cadastrar = (dados: NovoCadastro) =>
  api<RespostaCadastro>('/auth/cadastro', { method: 'POST', corpo: dados });

/** Código de 6 dígitos certo: devolve a sessão (igual ao login). 400 com `campos.codigo` se errado ou vencido. */
export async function confirmarEmail(email: string, codigo: string): Promise<RespostaLogin> {
  const r = await api<RespostaLogin>('/auth/confirmar-email', {
    method: 'POST',
    corpo: { email, codigo },
  });
  guardarTokens(r);
  return r;
}

/** Responde 204 sempre, exista ou não a conta. 429 se pedir demais. */
export const reenviarCodigo = (email: string) =>
  api<null>('/auth/reenviar-codigo', { method: 'POST', corpo: { email } });

/** Responde 204 sempre, exista ou não a conta. */
export function pedirNovaSenha(email: string): Promise<null> {
  return api<null>('/auth/esqueci-senha', { method: 'POST', corpo: { email } });
}

export async function sair(): Promise<void> {
  await api<null>('/auth/logout', { method: 'POST' }).catch(() => null);
  limparTokens();
}

// ----- Perfil e início -------------------------------------------------------

export const buscarPerfil = () => api<Perfil>('/me');
export const atualizarPerfil = (dados: AtualizarPerfil) =>
  api<Perfil>('/me', { method: 'PATCH', corpo: dados });
/** 204 em sucesso; senha atual errada volta 400. */
export const trocarSenha = (senha_atual: string, nova_senha: string) =>
  api<null>('/me/senha', { method: 'PATCH', corpo: { senha_atual, nova_senha } });
export const buscarDashboard = () => api<Dashboard>('/dashboard');

// ----- Apólices --------------------------------------------------------------

export const listarApolices = (p: Paginacao = {}) =>
  api<Pagina<ApoliceResumo>>(`/apolices${consulta(p)}`);
export const buscarApolice = (id: Id) => api<Apolice>(`/apolices/${id}`);
/** O link vale 60 s. No iPhone, abrir com `window.location.href = url` (window.open após await é bloqueado). */
export const linkPdfApolice = (id: Id) => api<LinkPdf>(`/apolices/${id}/pdf`);

// ----- Contatos --------------------------------------------------------------

export const listarContatos = (tipo: TipoContato) =>
  api<{ itens: Contato[] }>(`/contatos${consulta({ tipo })}`);

// ----- Sinistros -------------------------------------------------------------

export const listarSinistros = (p: Paginacao = {}) =>
  api<Pagina<SinistroResumo>>(`/sinistros${consulta(p)}`);
export const buscarSinistro = (id: Id) => api<Sinistro>(`/sinistros/${id}`);
/** 409 se a apólice não estiver ativa: mostrar `erro.message`. */
export const abrirSinistro = (dados: NovoSinistro) =>
  api<SinistroCriado>('/sinistros', { method: 'POST', corpo: dados });

// ----- Cotações --------------------------------------------------------------

export const listarCotacoes = (p: Paginacao = {}) =>
  api<Pagina<Cotacao>>(`/cotacoes${consulta(p)}`);
export const buscarCotacao = (id: Id) => api<Cotacao>(`/cotacoes/${id}`);
export const pedirCotacao = (dados: NovaCotacao) =>
  api<Cotacao>('/cotacoes', { method: 'POST', corpo: dados });

// ----- Indicações ------------------------------------------------------------

export const buscarLinkIndicacao = () => api<LinkIndicacao>('/indicacoes/link');
export const listarIndicacoes = (p: Paginacao = {}) =>
  api<Pagina<Indicacao>>(`/indicacoes${consulta(p)}`);

// ----- Notificações ----------------------------------------------------------

export const listarNotificacoes = (p: Paginacao & { nao_lidas?: boolean } = {}) =>
  api<Pagina<Notificacao>>(`/notificacoes${consulta(p)}`);
export const marcarNotificacaoLida = (id: Id) =>
  api<Notificacao>(`/notificacoes/${id}/lida`, { method: 'PATCH' });

// ----- Assistente ------------------------------------------------------------

/**
 * Manda o histórico recente (1 a 10 mensagens, a última da pessoa) e recebe a resposta.
 * 429: muitas perguntas seguidas; 503: assistente fora do ar.
 */
export const perguntarAssistente = (mensagens: MensagemAssistente[]) =>
  api<RespostaAssistente>('/assistente', { method: 'POST', corpo: { mensagens } });
