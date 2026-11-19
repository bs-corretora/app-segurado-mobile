import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';

export const TABS = ['home', 'cotacao', 'sinistro', 'assist', 'config'] as const;
export type Aba = (typeof TABS)[number];
/** Telas fora da sessão: sem cabeçalho nem abas. */
export const OUT = ['abrindo', 'login', 'cadastro', 'esqueci', 'esqueciok'] as const;

export const ehAba = (n: string): n is Aba => (TABS as readonly string[]).includes(n);
export const ehFora = (n: string): boolean => (OUT as readonly string[]).includes(n);

/** Tela atual: nome e, se houver, o argumento (id do registro, produto...). */
export type Rota = readonly [nome: string, arg?: string];
export type EstadoNav = { cur: Rota; pilha: Rota[] };

// Regras da pilha em funções puras (testadas em tests/nav.test.ts).

/** Abas e telas de fora zeram a pilha; telas internas empilham. */
export function navegar(e: EstadoNav, nome: string, arg?: string): EstadoNav {
  if (ehAba(nome) || ehFora(nome)) return { cur: [nome, arg], pilha: [] };
  return { cur: [nome, arg], pilha: [...e.pilha, e.cur] };
}

/** Troca a tela atual sem empilhar (ex.: formulário enviado → tela de confirmação). */
export const substituir = (e: EstadoNav, nome: string, arg?: string): EstadoNav => ({
  cur: [nome, arg],
  pilha: e.pilha,
});

/** Volta uma tela. Sem pilha: das telas de fora vai ao login; das demais, ao início. */
export function voltar(e: EstadoNav): EstadoNav {
  const pilha = [...e.pilha];
  const anterior = pilha.pop();
  if (anterior) return { cur: anterior, pilha };
  return { cur: [ehFora(e.cur[0]) ? 'login' : 'home'], pilha: [] };
}

/** Há para onde voltar com o botão "voltar" do aparelho? */
export function temOndeVoltar({ cur, pilha }: EstadoNav): boolean {
  if (pilha.length) return true;
  const [n] = cur;
  if (ehAba(n)) return n !== 'home';
  return n !== 'login' && n !== 'abrindo';
}

type Nav = {
  cur: Rota;
  go: (nome: string, arg?: string) => void;
  replace: (nome: string, arg?: string) => void;
  back: () => void;
};
const Ctx = createContext<Nav | null>(null);

export function useNav(): Nav {
  const nav = useContext(Ctx);
  if (!nav) throw new Error('useNav fora do NavProvider');
  return nav;
}

export function NavProvider({
  children,
  start = ['abrindo'],
}: {
  children: ReactNode;
  start?: Rota;
}) {
  const [estado, setEstado] = useState<EstadoNav>({ cur: start, pilha: [] });
  const go = useCallback((n: string, a?: string) => setEstado((e) => navegar(e, n, a)), []);
  const replace = useCallback((n: string, a?: string) => setEstado((e) => substituir(e, n, a)), []);
  const back = useCallback(() => setEstado(voltar), []);

  // Botão "voltar" do Android e gesto de voltar do navegador: enquanto houver para onde voltar,
  // o app deixa uma entrada extra no histórico e, quando ela sai, volta uma tela por dentro.
  const armadilha = useRef(false);
  useEffect(() => {
    if (temOndeVoltar(estado) && !armadilha.current) {
      history.pushState({ bs: true }, '');
      armadilha.current = true;
    }
  }, [estado]);
  useEffect(() => {
    const aoVoltar = () => {
      armadilha.current = false;
      setEstado((e) => (temOndeVoltar(e) ? voltar(e) : e));
    };
    window.addEventListener('popstate', aoVoltar);
    return () => window.removeEventListener('popstate', aoVoltar);
  }, []);

  const valor = useMemo(
    () => ({ cur: estado.cur, go, replace, back }),
    [estado.cur, go, replace, back],
  );
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}
