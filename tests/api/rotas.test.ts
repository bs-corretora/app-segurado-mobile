import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Cada função de src/api chama o método e a rota que o guia docs/integracao-api.md descreve.

function criarStorage() {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => void m.set(k, String(v)),
    removeItem: (k: string) => void m.delete(k),
    clear: () => m.clear(),
  };
}

type Chamada = { url: string; metodo: string; corpo: unknown };
let chamadas: Chamada[];
let status: number;

beforeEach(() => {
  vi.resetModules();
  vi.stubGlobal('localStorage', criarStorage());
  chamadas = [];
  status = 200;
  vi.stubGlobal('fetch', async (url: string, init: RequestInit = {}) => {
    chamadas.push({
      url: url.replace(/^.*\/api\/v1/, ''),
      metodo: init.method ?? 'GET',
      corpo: init.body ? JSON.parse(String(init.body)) : undefined,
    });
    return new Response(
      status === 204 ? null : JSON.stringify({ access_token: 'a', refresh_token: 'r' }),
      { status, headers: { 'Content-Type': 'application/json' } },
    );
  });
});
afterEach(() => vi.unstubAllGlobals());

const carregar = () => import('../../src/api');

describe('rotas da API', () => {
  it('RF-01: apólices, PDF e contatos', async () => {
    const api = await carregar();
    await api.listarApolices();
    await api.listarApolices({ pagina: 2, limite: 50 });
    await api.buscarApolice('a1');
    await api.linkPdfApolice('a1');
    await api.listarContatos('SINISTRO');
    expect(chamadas.map((c) => `${c.metodo} ${c.url}`)).toEqual([
      'GET /apolices',
      'GET /apolices?pagina=2&limite=50',
      'GET /apolices/a1',
      'GET /apolices/a1/pdf',
      'GET /contatos?tipo=SINISTRO',
    ]);
  });

  it('RF-03: sinistros', async () => {
    const api = await carregar();
    await api.listarSinistros();
    await api.buscarSinistro('s1');
    const novo = {
      apolice_id: 'a1',
      tipo: 'COLISAO' as const,
      data_ocorrencia: '2026-10-01T10:00:00.000Z',
    };
    await api.abrirSinistro(novo);
    expect(chamadas.map((c) => `${c.metodo} ${c.url}`)).toEqual([
      'GET /sinistros',
      'GET /sinistros/s1',
      'POST /sinistros',
    ]);
    expect(chamadas[2]!.corpo).toEqual(novo);
  });

  it('RF-04: cotações', async () => {
    const api = await carregar();
    await api.listarCotacoes();
    await api.buscarCotacao('c1');
    await api.pedirCotacao({ produto: 'AUTO', motivo: 'NOVO', dados: { cobertura: 'Completa' } });
    expect(chamadas.map((c) => `${c.metodo} ${c.url}`)).toEqual([
      'GET /cotacoes',
      'GET /cotacoes/c1',
      'POST /cotacoes',
    ]);
  });

  it('RF-05 e RF-06: indicações e notificações', async () => {
    const api = await carregar();
    await api.buscarLinkIndicacao();
    await api.listarIndicacoes();
    await api.listarNotificacoes({ nao_lidas: true });
    await api.marcarNotificacaoLida('n1');
    expect(chamadas.map((c) => `${c.metodo} ${c.url}`)).toEqual([
      'GET /indicacoes/link',
      'GET /indicacoes',
      'GET /notificacoes?nao_lidas=true',
      'PATCH /notificacoes/n1/lida',
    ]);
  });

  it('Base: perfil, início, troca de senha e assistente', async () => {
    const api = await carregar();
    await api.buscarPerfil();
    await api.atualizarPerfil({ telefone: null, aceita_marketing: false });
    await api.buscarDashboard();
    status = 204;
    await api.trocarSenha('antiga123', 'nova12345');
    status = 200;
    await api.perguntarAssistente([{ papel: 'usuario', texto: 'O que é franquia?' }]);
    expect(chamadas.map((c) => `${c.metodo} ${c.url}`)).toEqual([
      'GET /me',
      'PATCH /me',
      'GET /dashboard',
      'PATCH /me/senha',
      'POST /assistente',
    ]);
    expect(chamadas[3]!.corpo).toEqual({ senha_atual: 'antiga123', nova_senha: 'nova12345' });
  });

  it('Base: login e cadastro guardam a sessão; sair apaga mesmo se a API falhar', async () => {
    const api = await carregar();
    await api.entrar('ana@bs.com', 'segredo123');
    expect(api.temSessao()).toBe(true);
    status = 500;
    await api.sair();
    expect(api.temSessao()).toBe(false);
    status = 201;
    await api.cadastrar({
      nome: 'Ana Souza',
      cpf: '52998224725',
      email: 'ana@bs.com',
      telefone: '81999998888',
      data_nascimento: '1990-05-01',
      senha: 'segredo123',
      aceite_termos: true,
      aceita_marketing: false,
    });
    expect(chamadas.at(-1)!.corpo).toMatchObject({ aceita_marketing: false });
    expect(api.temSessao()).toBe(true);
    status = 204;
    await api.pedirNovaSenha('ana@bs.com');
    expect(chamadas.map((c) => `${c.metodo} ${c.url}`)).toEqual([
      'POST /auth/login',
      'POST /auth/logout',
      'POST /auth/cadastro',
      'POST /auth/esqueci-senha',
    ]);
  });
});
