import { Aviso } from './Aviso';
import { Botao } from './Botao';
import type { ResultadoPaginado } from '../hooks/useApi';

/** Botão "carregar mais" no fim de uma lista paginada. */
export function MaisItens<T>({ r }: { r: ResultadoPaginado<T> }) {
  if (!r.temMais) return null;
  return (
    <>
      {r.erroMais && <Aviso tipo="err">{r.erroMais}</Aviso>}
      <Botao variante="sec" carregando={r.carregandoMais} onClick={r.carregarMais}>
        Carregar mais
      </Botao>
    </>
  );
}
