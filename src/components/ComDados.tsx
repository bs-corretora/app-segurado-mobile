import type { ReactNode } from 'react';
import { Carregando } from './Carregando';
import { Erro } from './Erro';
import type { ResultadoApi } from '../hooks/useApi';

/** Mostra carregando/erro até os dados chegarem; depois entrega os dados para `children`. */
export function ComDados<T>({
  r,
  children,
  textoCarregando,
}: {
  r: ResultadoApi<T>;
  children: (dados: T) => ReactNode;
  textoCarregando?: string;
}) {
  if (r.dados === null) {
    if (r.erro) return <Erro mensagem={r.erro} aoTentar={r.tentarDeNovo} />;
    return <Carregando texto={textoCarregando} />;
  }
  return <>{children(r.dados)}</>;
}
