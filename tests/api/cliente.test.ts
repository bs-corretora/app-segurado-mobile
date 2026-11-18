import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// localStorage em memória (o Vitest roda em Node, sem navegador).
function criarStorage() {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, String(v)),
    removeItem: (k: string) => void m.delete(k),
    clear: () => m.clear(),
  };
}

function resposta(status: number, corpo?: unknown): Response {
  return new Response(corpo === undefined ? null : JSON.stringify(corpo), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

type Chamada = { url: string; init: RequestInit };
let chamadas: Chamada[];
let responder: (url: string, init: RequestInit) => Response | Promise<Response>;

beforeEach(async () => {
  vi.resetModules();
  vi.stubGlobal('localStorage', criarStorage());
  chamadas = [];
  vi.stubGlobal('fetch', async (url: string, init: RequestInit = {}) => {
    chamadas.push({ url, init });
    return responder(url, init);
  });
});
afterEach(() => vi.unstubAllGlobals());

const carregar = () => import('../../src/api');
const cabecalho = (c: Chamada | undefined, nome: string) =>
  (c?.init.headers as Record<string, string> | undefined)?.[nome];

describe('cliente da API', () => {
  it('AUTH: login guarda os tokens e as chamadas seguintes mandam o Bearer', async () => {
    const api = await carregar();
    responder = (url) =>
      url.endsWith('/auth/login')
        ? resposta(200, {
            id: '1',
            email: 'a@b.c',
            access_token: 'A1',
            refresh_token: 'R1',
            expires_in: 3600,
            expires_at: 0,
          })
        : resposta(200, { nome: 'Maria' });

    await api.entrar('a@b.c', 'x');
    expect(api.temSessao()).toBe(true);
    await api.buscarDashboard();
    expect(cabecalho(chamadas[1], 'Authorization')).toBe('Bearer A1');
  });

  it('AUTH: com várias chamadas recebendo 401 juntas, renova o token uma vez só', async () => {
    const api = await carregar();
    localStorage.setItem('access_token', 'vencido');
    localStorage.setItem('refresh_token', 'R1');
    responder = (url, init) => {
      if (url.endsWith('/auth/refresh'))
        return resposta(200, { access_token: 'A2', refresh_token: 'R2' });
      return cabecalho({ url, init }, 'Authorization') === 'Bearer A2'
        ? resposta(200, { ok: true })
        : resposta(401, {});
    };

    const r = await Promise.all([
      api.buscarPerfil(),
      api.listarApolices(),
      api.listarNotificacoes(),
    ]);
    expect(r.every(Boolean)).toBe(true);
    expect(chamadas.filter((c) => c.url.endsWith('/auth/refresh'))).toHaveLength(1);
    expect(localStorage.getItem('refresh_token')).toBe('R2');
  });

  it('AUTH: se a renovação falha, apaga a sessão e avisa o app', async () => {
    const api = await carregar();
    localStorage.setItem('access_token', 'vencido');
    localStorage.setItem('refresh_token', 'usado');
    const aoAcabar = vi.fn();
    api.quandoSessaoAcabar(aoAcabar);
    responder = () =>
      resposta(401, {
        status: 401,
        erro: 'NAO_AUTENTICADO',
        mensagem: 'Sessão ausente ou expirada',
      });

    await expect(api.buscarPerfil()).rejects.toMatchObject({ status: 401 });
    expect(aoAcabar).toHaveBeenCalledOnce();
    expect(api.temSessao()).toBe(false);
  });

  it('AUTH: 401 no próprio login não tenta renovar nem encerra sessão', async () => {
    const api = await carregar();
    const aoAcabar = vi.fn();
    api.quandoSessaoAcabar(aoAcabar);
    responder = () =>
      resposta(401, {
        status: 401,
        erro: 'NAO_AUTENTICADO',
        mensagem: 'E-mail ou senha inválidos',
      });

    await expect(api.entrar('a@b.c', 'errada')).rejects.toThrow('E-mail ou senha inválidos');
    expect(chamadas).toHaveLength(1);
    expect(aoAcabar).not.toHaveBeenCalled();
  });

  it('RF-03: erro 400 traz a mensagem de cada campo', async () => {
    const api = await carregar();
    responder = () =>
      resposta(400, {
        status: 400,
        erro: 'VALIDACAO',
        mensagem: 'dados inválidos',
        campos: { data_ocorrencia: 'não pode ser futura' },
      });

    const e = await api
      .abrirSinistro({ apolice_id: 'x', tipo: 'COLISAO', data_ocorrencia: '2099-01-01T00:00:00Z' })
      .catch((x: unknown) => x);
    expect(e).toBeInstanceOf(api.ErroApi);
    expect((e as InstanceType<typeof api.ErroApi>).campos.data_ocorrencia).toBe(
      'não pode ser futura',
    );
    expect(chamadas[0]?.init.body).toContain('"tipo":"COLISAO"');
  });

  it('AUTH: resposta 204 vira null e logout apaga os tokens mesmo com erro de rede', async () => {
    const api = await carregar();
    localStorage.setItem('access_token', 'A1');
    responder = () => resposta(204);
    await expect(api.pedirNovaSenha('a@b.c')).resolves.toBeNull();

    responder = () => Promise.reject(new TypeError('sem rede'));
    await api.sair();
    expect(api.temSessao()).toBe(false);
  });

  it('RF-06: filtros viram query string e campos indefinidos não entram', async () => {
    const api = await carregar();
    responder = () => resposta(200, { itens: [], pagina: 1, limite: 20, total: 0 });
    await api.listarNotificacoes({ nao_lidas: true });
    await api.listarApolices();
    expect(chamadas[0]?.url).toMatch(/\/notificacoes\?nao_lidas=true$/);
    expect(chamadas[1]?.url).toMatch(/\/apolices$/);
  });
});
