import { listarCotacoes } from '../../api';
import type { Cotacao as CotacaoApi } from '../../api';
import { MOTIVO, PRODUTO } from '../../constants/rotulos';
import { GLOSSARIO } from '../../constants/glossario';
import { data } from '../../utils/formatos';
import { Botao, Card, ComDados, MaisItens, Tag, Vazio } from '../../components';
import { useNav } from '../../app/nav';
import { usePaginado } from '../../hooks/useApi';

function ResumoCotacao({ c }: { c: CotacaoApi }) {
  const cobertura = c.dados?.cobertura;
  return (
    <>
      {MOTIVO[c.motivo]}
      {typeof cobertura === 'string' && (
        <>
          {' · '}
          <span className="tooltip" data-tooltip={GLOSSARIO.cobertura}>
            Cobertura
          </span>
          : {cobertura}
        </>
      )}
      {' · '}
      {data(c.criado_em)}
    </>
  );
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
              <div className="grid-2col">
                {itens.map((c) => (
                  <Card key={c.id} onClick={() => go('cot-det', c.id)}>
                    <div className="row">
                      <b>{PRODUTO[c.produto]}</b>
                      <Tag s={c.status} />
                    </div>
                    <div className="mut">
                      <ResumoCotacao c={c} />
                    </div>
                  </Card>
                ))}
              </div>
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
