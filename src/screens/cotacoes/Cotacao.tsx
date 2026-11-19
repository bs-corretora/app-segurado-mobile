import { listarCotacoes } from '../../api';
import type { Cotacao as CotacaoApi } from '../../api';
import { MOTIVO, PRODUTO } from '../../constants/rotulos';
import { data } from '../../utils/formatos';
import { Botao, Card, ComDados, MaisItens, Tag, Vazio } from '../../components';
import { useNav } from '../../app/nav';
import { usePaginado } from '../../hooks/useApi';

function resumoCotacao(c: CotacaoApi): string {
  const cobertura = c.dados?.cobertura;
  return [
    MOTIVO[c.motivo],
    typeof cobertura === 'string' ? `Cobertura: ${cobertura}` : null,
    data(c.criado_em),
  ]
    .filter(Boolean)
    .join(' · ');
}

export function Cotacao() {
  const { go } = useNav();
  const r = usePaginado(listarCotacoes);
  return (
    <>
      <Botao onClick={() => go('cot-prod')}>Nova cotação</Botao>
      <h2>Meus pedidos</h2>
      <ComDados r={r}>
        {(itens) =>
          itens.length ? (
            <>
              {itens.map((c) => (
                <Card key={c.id} onClick={() => go('cot-det', c.id)}>
                  <div className="row">
                    <b>{PRODUTO[c.produto]}</b>
                    <Tag s={c.status} />
                  </div>
                  <div className="mut">{resumoCotacao(c)}</div>
                </Card>
              ))}
              <MaisItens r={r} />
            </>
          ) : (
            <Vazio texto="Você ainda não pediu nenhuma cotação." />
          )
        }
      </ComDados>
    </>
  );
}
