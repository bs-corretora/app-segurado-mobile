import { Aviso, ComDados, KV, Tag } from '../../components';
import { MOTIVO, PRODUTO, rotuloCampoCotacao } from '../../constants/rotulos';
import { buscarCotacao } from '../../api';
import { data, moeda, valorCampoCotacao } from '../../utils/formatos';
import { useApi } from '../../hooks/useApi';

export function CotDet({ arg }: { arg?: string }) {
  const id = arg ?? '';
  const r = useApi(() => buscarCotacao(id), [id]);
  return (
    <ComDados r={r}>
      {(c) => (
        <>
          <div className="card col">
            <div className="row">
              <h1>{PRODUTO[c.produto]}</h1>
              <Tag s={c.status} />
            </div>
            <KV k="Tipo de pedido" v={MOTIVO[c.motivo]} />
            <KV k="Pedido em" v={data(c.criado_em)} />
            {Object.entries(c.dados ?? {}).map(([k, v]) => (
              <KV key={k} k={rotuloCampoCotacao(k)} v={valorCampoCotacao(k, v)} />
            ))}
          </div>
          {c.status === 'RESPONDIDA' ? (
            <div className="card col">
              {c.valor_estimado !== null && (
                <>
                  <span className="mut">Valor estimado</span>
                  <div className="big">{moeda(c.valor_estimado)}</div>
                </>
              )}
              <span className="mut">Resposta da BS Seguros · {data(c.respondida_em)}</span>
              <span>{c.resposta ?? 'Fale conosco para contratar.'}</span>
            </div>
          ) : (
            <Aviso tipo="info">
              {c.status === 'RECEBIDA'
                ? 'Recebemos seu pedido. Você será avisado nas notificações quando houver resposta.'
                : 'Nossa equipe está analisando seu pedido. Você será avisado quando houver resposta.'}
            </Aviso>
          )}
        </>
      )}
    </ComDados>
  );
}
