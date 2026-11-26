// @vitest-environment jsdom
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ErroApi } from '../src/api';
import type { Pagina } from '../src/api';
import { useApi, usePaginado } from '../src/hooks/useApi';
import { useEnvio } from '../src/hooks/useEnvio';
import { useOnline } from '../src/hooks/useOnline';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

/** Promessa que o teste resolve na hora que quiser. */
function adiada<T>() {
  let resolver!: (v: T) => void;
  let rejeitar!: (e: unknown) => void;
  const promessa = new Promise<T>((res, rej) => {
    resolver = res;
    rejeitar = rej;
  });
  return { promessa, resolver, rejeitar };
}

describe('useApi', () => {
  it('RF-01: começa carregando e mostra os dados quando a API responde', async () => {
    const { result } = renderHook(() => useApi(() => Promise.resolve({ numero: 'AU-1' })));
    expect(result.current.carregando).toBe(true);
    await waitFor(() => expect(result.current.carregando).toBe(false));
    expect(result.current.dados).toEqual({ numero: 'AU-1' });
    expect(result.current.erro).toBeNull();
  });

  it('RF-01: erro da API vira mensagem para a pessoa e "tentar de novo" busca outra vez', async () => {
    const buscar = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new ErroApi(503, null))
      .mockResolvedValueOnce('ok');
    const { result } = renderHook(() => useApi(buscar));
    await waitFor(() =>
      expect(result.current.erro).toBe(
        'O serviço está fora do ar agora. Tente de novo em instantes.',
      ),
    );
    act(() => result.current.tentarDeNovo());
    await waitFor(() => expect(result.current.dados).toBe('ok'));
    expect(result.current.erro).toBeNull();
    expect(buscar).toHaveBeenCalledTimes(2);
  });

  it('RF-01: busca de novo quando as dependências mudam', async () => {
    const buscar = vi.fn((id: string) => Promise.resolve(`apólice ${id}`));
    const { result, rerender } = renderHook(({ id }) => useApi(() => buscar(id), [id]), {
      initialProps: { id: 'a' },
    });
    await waitFor(() => expect(result.current.dados).toBe('apólice a'));
    rerender({ id: 'b' });
    await waitFor(() => expect(result.current.dados).toBe('apólice b'));
  });

  it('RF-01: resposta que chega depois de a tela sair é ignorada', async () => {
    const d = adiada<string>();
    const { result, unmount } = renderHook(() => useApi(() => d.promessa));
    unmount();
    await act(async () => d.resolver('tarde demais'));
    expect(result.current.dados).toBeNull();

    const e = adiada<string>();
    const outro = renderHook(() => useApi(() => e.promessa));
    outro.unmount();
    await act(async () => e.rejeitar(new Error('x')));
    expect(outro.result.current.erro).toBeNull();
  });
});

describe('usePaginado', () => {
  const pagina = (n: number, total: number): Pagina<number> => ({
    itens: [n * 10 + 1, n * 10 + 2],
    pagina: n,
    limite: 2,
    total,
  });

  it('RF-06: junta as páginas e para quando chegou ao total', async () => {
    const listar = vi.fn(({ pagina: n }: { pagina: number }) => Promise.resolve(pagina(n, 4)));
    const { result } = renderHook(() => usePaginado(listar, 2));
    await waitFor(() => expect(result.current.dados).toEqual([11, 12]));
    expect(result.current.temMais).toBe(true);
    expect(result.current.total).toBe(4);

    act(() => result.current.carregarMais());
    await waitFor(() => expect(result.current.dados).toEqual([11, 12, 21, 22]));
    expect(result.current.temMais).toBe(false);
    expect(listar).toHaveBeenLastCalledWith({ pagina: 2, limite: 2 });
  });

  it('RF-06: erro ao carregar mais mostra a mensagem e mantém o que já veio', async () => {
    const listar = vi
      .fn<(p: { pagina: number; limite: number }) => Promise<Pagina<number>>>()
      .mockResolvedValueOnce(pagina(1, 4))
      .mockRejectedValueOnce(new ErroApi(500, null));
    const { result } = renderHook(() => usePaginado(listar, 2));
    await waitFor(() => expect(result.current.temMais).toBe(true));
    act(() => result.current.carregarMais());
    await waitFor(() => expect(result.current.erroMais).toMatch(/nosso lado/));
    expect(result.current.dados).toEqual([11, 12]);
    expect(result.current.carregandoMais).toBe(false);
  });

  it('RF-06: "carregar mais" antes da primeira página não faz nada', () => {
    const listar = vi.fn(() => new Promise<Pagina<number>>(() => {}));
    const { result } = renderHook(() => usePaginado(listar));
    act(() => result.current.carregarMais());
    expect(listar).toHaveBeenCalledTimes(1);
    expect(result.current.dados).toBeNull();
  });
});

describe('useEnvio', () => {
  it('RF-03: validação local barra o envio e mostra o erro em cada campo', async () => {
    const acao = vi.fn(() => Promise.resolve('ok'));
    const { result } = renderHook(() => useEnvio());
    let r: string | undefined = 'x';
    await act(async () => {
      r = await result.current.enviar(acao, () => ({ local: undefined, descricao: 'Curta' }));
    });
    expect(r).toBeUndefined();
    expect(acao).not.toHaveBeenCalled();
    expect(result.current.campos).toEqual({ descricao: 'Curta' });
    expect(result.current.erro).toBe('Confira os campos destacados.');
  });

  it('RF-03: envia, devolve a resposta e limpa os erros anteriores', async () => {
    const { result } = renderHook(() => useEnvio());
    await act(async () => {
      await result.current.enviar(
        () => Promise.resolve(1),
        () => ({ a: 'erro' }),
      );
    });
    let r: number | undefined;
    await act(async () => {
      r = await result.current.enviar(
        () => Promise.resolve(2),
        () => ({}),
      );
    });
    expect(r).toBe(2);
    expect(result.current.campos).toEqual({});
    expect(result.current.erro).toBeNull();
    expect(result.current.enviando).toBe(false);
  });

  it('RF-03: erro 400 da API vira mensagem embaixo de cada campo', async () => {
    const { result } = renderHook(() => useEnvio());
    await act(async () => {
      await result.current.enviar(() =>
        Promise.reject(
          new ErroApi(400, {
            erro: 'VALIDACAO',
            mensagem: 'inválido',
            campos: { data_ocorrencia: 'data_ocorrencia não pode ser futura' },
          }),
        ),
      );
    });
    expect(result.current.campos).toEqual({ data_ocorrencia: 'Não pode ser futura' });
    expect(result.current.erro).toBe('Confira os campos destacados.');
  });

  it('RF-03: erro que não é da API vira mensagem geral, sem campos', async () => {
    const { result } = renderHook(() => useEnvio());
    await act(async () => {
      await result.current.enviar(() => Promise.reject(new TypeError('Failed to fetch')));
    });
    expect(result.current.campos).toEqual({});
    expect(result.current.erro).toEqual(expect.any(String));
  });

  it('RF-03: segundo toque durante o envio é ignorado e a demora é avisada', async () => {
    vi.useFakeTimers();
    const d = adiada<string>();
    const acao = vi.fn(() => d.promessa);
    const { result } = renderHook(() => useEnvio());
    let primeira!: Promise<string | undefined>;
    act(() => {
      primeira = result.current.enviar(acao);
    });
    expect(result.current.enviando).toBe(true);
    let segunda: string | undefined = 'x';
    await act(async () => {
      segunda = await result.current.enviar(acao);
    });
    expect(segunda).toBeUndefined();
    expect(acao).toHaveBeenCalledTimes(1);

    act(() => vi.advanceTimersByTime(6000));
    expect(result.current.demorando).toBe(true);
    await act(async () => {
      d.resolver('pronto');
      await primeira;
    });
    expect(result.current.demorando).toBe(false);
    expect(result.current.enviando).toBe(false);
  });
});

describe('useOnline', () => {
  it('PWA: acompanha os avisos de sem internet do aparelho', () => {
    const online = vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    const { result } = renderHook(() => useOnline());
    expect(result.current).toBe(true);
    online.mockReturnValue(false);
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    expect(result.current).toBe(false);
    online.mockReturnValue(true);
    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    expect(result.current).toBe(true);
  });
});
