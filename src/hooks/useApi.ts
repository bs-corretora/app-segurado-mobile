// Os três estados de toda tela que lê dado: carregando, erro (com "tentar de novo") e pronto.
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Pagina } from '../api';
import { mensagemDeErro } from '../utils/formatos';

export type ResultadoApi<T> = {
  dados: T | null;
  erro: string | null;
  carregando: boolean;
  tentarDeNovo: () => void;
};

/**
 * `const r = useApi(() => buscarApolice(id), [id])`.
 * Busca ao montar e sempre que algo em `deps` mudar; ignora respostas que chegam depois de a
 * tela sair.
 */
export function useApi<T>(
  buscar: () => Promise<T>,
  deps: readonly unknown[] = [],
): ResultadoApi<T> {
  const [dados, setDados] = useState<T | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [tentativa, setTentativa] = useState(0);
  const buscarRef = useRef(buscar);
  buscarRef.current = buscar;

  useEffect(() => {
    let cancelado = false;
    setErro(null);
    setCarregando(true);
    buscarRef
      .current()
      .then((d) => {
        if (cancelado) return;
        setDados(d);
        setCarregando(false);
      })
      .catch((e: unknown) => {
        if (cancelado) return;
        setErro(mensagemDeErro(e));
        setCarregando(false);
      });
    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps vêm de quem chama
  }, [tentativa, ...deps]);

  const tentarDeNovo = useCallback(() => setTentativa((n) => n + 1), []);
  return { dados, erro, carregando, tentarDeNovo };
}

export type ResultadoPaginado<T> = ResultadoApi<T[]> & {
  total: number;
  temMais: boolean;
  carregandoMais: boolean;
  erroMais: string | null;
  carregarMais: () => void;
};

/** Lista paginada da API com botão "carregar mais". */
export function usePaginado<T>(
  listar: (p: { pagina: number; limite: number }) => Promise<Pagina<T>>,
  limite = 20,
): ResultadoPaginado<T> {
  const [paginas, setPaginas] = useState<{ itens: T[]; pagina: number; total: number } | null>(
    null,
  );
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [erroMais, setErroMais] = useState<string | null>(null);

  const primeira = useApi(() => listar({ pagina: 1, limite }));
  useEffect(() => {
    if (primeira.dados) {
      const { itens, pagina, total } = primeira.dados;
      setPaginas({ itens, pagina, total });
      setErroMais(null);
    }
  }, [primeira.dados]);

  const listarRef = useRef(listar);
  listarRef.current = listar;
  const carregarMais = useCallback(() => {
    if (!paginas || carregandoMais) return;
    setCarregandoMais(true);
    setErroMais(null);
    listarRef
      .current({ pagina: paginas.pagina + 1, limite })
      .then((p) =>
        setPaginas((atual) => ({
          itens: [...(atual?.itens ?? []), ...p.itens],
          pagina: p.pagina,
          total: p.total,
        })),
      )
      .catch((e: unknown) => setErroMais(mensagemDeErro(e)))
      .finally(() => setCarregandoMais(false));
  }, [paginas, carregandoMais, limite]);

  const itens = primeira.dados ? (paginas?.itens ?? primeira.dados.itens) : null;
  return {
    dados: itens,
    erro: primeira.erro,
    carregando: primeira.carregando,
    tentarDeNovo: primeira.tentarDeNovo,
    total: paginas?.total ?? 0,
    temMais: !!paginas && paginas.itens.length < paginas.total,
    carregandoMais,
    erroMais,
    carregarMais,
  };
}
