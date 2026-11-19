import { CartaoApolice, ComDados, MaisItens, Vazio } from '../../components';
import { listarApolices } from '../../api';
import { usePaginado } from '../../hooks/useApi';

export function Apolices() {
  const r = usePaginado(listarApolices);
  return (
    <ComDados r={r}>
      {(itens) =>
        itens.length ? (
          <>
            {itens.map((a) => (
              <CartaoApolice key={a.id} a={a} />
            ))}
            <MaisItens r={r} />
          </>
        ) : (
          <Vazio texto="Você ainda não tem apólices na BS Seguros." />
        )
      }
    </ComDados>
  );
}
