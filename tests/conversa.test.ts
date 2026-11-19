import { describe, expect, it, vi } from 'vitest';
import { ErroApi } from '../src/api/cliente';
import type { MensagemAssistente, RespostaAssistente } from '../src/api';
import { criarConversa, historicoParaApi, MAX_HISTORICO } from '../src/hooks/useConversa';
import type { MensagemConversa } from '../src/hooks/useConversa';
import { destinoDoAtalho } from '../src/utils/destinoAtalho';

const resposta = (texto: string, extra: Partial<RespostaAssistente> = {}): RespostaAssistente => ({
  resposta: texto,
  fontes: [],
  atalhos: [],
  ...extra,
});

/** Promessa que o teste resolve na hora que quiser, para ver o estado "digitando". */
function adiada<T>() {
  let resolver!: (v: T) => void;
  let rejeitar!: (e: unknown) => void;
  const promessa = new Promise<T>((res, rej) => {
    resolver = res;
    rejeitar = rej;
  });
  return { promessa, resolver, rejeitar };
}

describe('conversa com o assistente', () => {
  it('ASSIST: pergunta, fica "digitando" e recebe a resposta com fontes e atalhos', async () => {
    const espera = adiada<RespostaAssistente>();
    const perguntar = vi.fn(() => espera.promessa);
    const c = criarConversa(perguntar);
    const mudancas = vi.fn();
    c.assinar(mudancas);

    const enviando = c.enviar('  Quando vence minha apólice?  ');
    expect(c.estado().esperando).toBe(true);
    expect(c.estado().mensagens).toMatchObject([
      { papel: 'usuario', texto: 'Quando vence minha apólice?' },
    ]);
    expect(perguntar).toHaveBeenCalledWith([
      { papel: 'usuario', texto: 'Quando vence minha apólice?' },
    ]);

    espera.resolver(
      resposta('Vence em 10/01.', {
        fontes: [{ id: 'f1', titulo: 'Vigência' }],
        atalhos: [{ rotulo: 'Ver apólice', tela: '/apolices/a1' }],
      }),
    );
    await enviando;

    const { mensagens, esperando, erro } = c.estado();
    expect(esperando).toBe(false);
    expect(erro).toBeNull();
    expect(mensagens[1]).toMatchObject({
      papel: 'assistente',
      texto: 'Vence em 10/01.',
      fontes: [{ id: 'f1', titulo: 'Vigência' }],
      atalhos: [{ rotulo: 'Ver apólice', tela: '/apolices/a1' }],
    });
    expect(mudancas).toHaveBeenCalled();
  });

  it('ASSIST: ignora texto vazio e pergunta nova enquanto espera a anterior', async () => {
    const espera = adiada<RespostaAssistente>();
    const perguntar = vi.fn(() => espera.promessa);
    const c = criarConversa(perguntar);

    await c.enviar('   ');
    expect(perguntar).not.toHaveBeenCalled();

    const primeira = c.enviar('Oi');
    await c.enviar('Outra');
    expect(perguntar).toHaveBeenCalledTimes(1);
    espera.resolver(resposta('Olá!'));
    await primeira;
    expect(c.estado().mensagens.map((m) => m.texto)).toEqual(['Oi', 'Olá!']);
  });

  it('ASSIST: manda só as últimas 10 mensagens, com a pergunta nova por último', async () => {
    const enviados: MensagemAssistente[][] = [];
    const c = criarConversa(async (m) => {
      enviados.push(m);
      return resposta(`r${enviados.length}`);
    });
    for (let i = 1; i <= 6; i++) await c.enviar(`p${i}`);

    expect(c.estado().mensagens).toHaveLength(12);
    const ultimo = enviados.at(-1)!;
    expect(ultimo).toHaveLength(MAX_HISTORICO);
    expect(ultimo[0]).toEqual({ papel: 'assistente', texto: 'r1' });
    expect(ultimo.at(-1)).toEqual({ papel: 'usuario', texto: 'p6' });
  });

  it('ASSIST: corta texto longo no limite da API', () => {
    const longa: MensagemConversa = { id: 1, papel: 'assistente', texto: 'x'.repeat(5000) };
    expect(historicoParaApi([longa])[0]!.texto).toHaveLength(4000);
  });

  it('ASSIST: 429 e 503 têm mensagem própria; tentar de novo reenvia a mesma pergunta', async () => {
    const perguntar = vi
      .fn<(m: MensagemAssistente[]) => Promise<RespostaAssistente>>()
      .mockRejectedValueOnce(new ErroApi(429, { erro: 'LIMITE', mensagem: 'x' }))
      .mockRejectedValueOnce(new ErroApi(503, { erro: 'INDISPONIVEL', mensagem: 'x' }))
      .mockResolvedValueOnce(resposta('Pronto.'));
    const c = criarConversa(perguntar);

    await c.enviar('Como abro um sinistro?');
    expect(c.estado().erro).toMatch(/muitas perguntas seguidas/i);
    expect(c.estado().esperando).toBe(false);

    await c.tentarDeNovo();
    expect(c.estado().erro).toMatch(/indisponível agora/i);

    await c.tentarDeNovo();
    expect(c.estado().erro).toBeNull();
    expect(perguntar).toHaveBeenCalledTimes(3);
    for (const [m] of perguntar.mock.calls)
      expect(m).toEqual([{ papel: 'usuario', texto: 'Como abro um sinistro?' }]);
    expect(c.estado().mensagens.map((m) => m.papel)).toEqual(['usuario', 'assistente']);
  });

  it('ASSIST: tentar de novo não faz nada quando a última mensagem já tem resposta', async () => {
    const perguntar = vi.fn(async () => resposta('ok'));
    const c = criarConversa(perguntar);
    await c.tentarDeNovo();
    await c.enviar('Oi');
    await c.tentarDeNovo();
    expect(perguntar).toHaveBeenCalledTimes(1);
  });
});

describe('atalhos do assistente', () => {
  it.each([
    ['/inicio', undefined, ['home']],
    ['/apolices', undefined, ['apolices']],
    ['/apolices/a1', undefined, ['apolice', 'a1']],
    ['/apolices/:id', 'a2', ['apolice', 'a2']],
    ['/apolices', 'a3', ['apolice', 'a3']],
    ['/sinistros', undefined, ['sinistro']],
    ['/sinistros/novo', undefined, ['sin-novo']],
    ['/sinistros/s1', undefined, ['sin-det', 's1']],
    ['/cotacoes', undefined, ['cotacao']],
    ['/cotacoes/nova', undefined, ['cot-prod']],
    ['/cotacoes/:id', 'c1', ['cot-det', 'c1']],
    ['/contatos', undefined, ['ajuda']],
    ['/notificacoes', undefined, ['notif']],
    ['/perfil', undefined, ['perfil']],
    ['/indicacoes', undefined, ['indicar']],
  ] as const)('%s (id %s) leva para %j', (tela, id, destino) => {
    expect(destinoDoAtalho({ rotulo: 'x', tela, id })).toEqual(destino);
  });

  it.each(['/pagamentos', '/apolices/:id', '/apolices/a1/pdf', '', '/'])(
    'caminho desconhecido ou sem id esconde o botão: %j',
    (tela) => {
      expect(destinoDoAtalho({ rotulo: 'x', tela })).toBeNull();
    },
  );
});
