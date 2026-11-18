// Resumo da pessoa logada (nome, iniciais, notificações não lidas, apólices ativas), compartilhado
// entre o cabeçalho e o início. Vem de GET /dashboard e é atualizado quando a pessoa volta ao app.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { buscarDashboard, type Dashboard } from './api';
import { mensagemDeErro } from './formatos';

type Sessao = {
  resumo: Dashboard | null;
  erro: string | null;
  /** Busca o resumo de novo. Devolve `false` se falhou (o erro fica em `erro`). */
  atualizar: () => Promise<boolean>;
  /** Esquece o resumo (ao sair). */
  limpar: () => void;
  /** Ajusta o contador do sininho sem esperar a API (ex.: ao abrir uma notificação). */
  descontarLida: () => void;
};

const Ctx = createContext<Sessao | null>(null);

export function useSessao(): Sessao {
  const s = useContext(Ctx);
  if (!s) throw new Error('useSessao fora do SessaoProvider');
  return s;
}

export function SessaoProvider({ children }: { children: ReactNode }) {
  const [resumo, setResumo] = useState<Dashboard | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const atualizar = useCallback(async () => {
    setErro(null);
    try {
      setResumo(await buscarDashboard());
      return true;
    } catch (e) {
      setErro(mensagemDeErro(e));
      return false;
    }
  }, []);
  const limpar = useCallback(() => {
    setResumo(null);
    setErro(null);
  }, []);
  const descontarLida = useCallback(
    () => setResumo((r) => (r ? { ...r, nao_lidas: Math.max(0, r.nao_lidas - 1) } : r)),
    [],
  );

  // Não existe push com o app fechado: o sininho se atualiza quando a pessoa volta ao app.
  const logado = resumo !== null;
  useEffect(() => {
    if (!logado) return;
    const aoVoltar = () => {
      if (document.visibilityState === 'visible') void atualizar();
    };
    document.addEventListener('visibilitychange', aoVoltar);
    return () => document.removeEventListener('visibilitychange', aoVoltar);
  }, [logado, atualizar]);

  const valor = useMemo(
    () => ({ resumo, erro, atualizar, limpar, descontarLida }),
    [resumo, erro, atualizar, limpar, descontarLida],
  );
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}
