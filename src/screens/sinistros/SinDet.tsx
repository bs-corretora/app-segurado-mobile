import { ComDados, KV, Tag, Vazio } from '../../components';
import { STATUS, TIPO_SINISTRO } from '../../constants/rotulos';
import { buscarApolice, buscarSinistro } from '../../api';
import { dataHora } from '../../utils/formatos';
import { rotuloApolice } from '../../utils/rotuloApolice';
import { useApi } from '../../hooks/useApi';

export function SinDet({ arg }: { arg?: string }) {
  const id = arg ?? '';
  const r = useApi(async () => {
    const s = await buscarSinistro(id);
    const apolice = await buscarApolice(s.apolice_id).catch(() => null);
    return { s, apolice };
  }, [id]);

  return (
    <ComDados r={r}>
      {({ s, apolice }) => (
        <>
          <div className="card col">
            <div className="row">
              <b>{s.protocolo}</b>
              <Tag s={s.status} />
            </div>
            <KV k="Tipo" v={TIPO_SINISTRO[s.tipo]} />
            {apolice && <KV k="Apólice" v={rotuloApolice(apolice)} />}
            <KV k="Ocorrência" v={dataHora(s.data_ocorrencia)} />
            {s.local && <KV k="Local" v={s.local} />}
            {s.descricao && (
              <div className="col desc">
                <span className="mut">Descrição</span>
                <span>{s.descricao}</span>
              </div>
            )}
          </div>
          <h2>Histórico</h2>
          {s.eventos.length ? (
            <ol className="tl">
              {[...s.eventos].reverse().map((ev) => (
                <li key={ev.id}>
                  <b>{STATUS[ev.status][0]}</b>
                  <div className="mut">
                    {dataHora(ev.criado_em)}
                    {ev.comentario ? ` · ${ev.comentario}` : ''}
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <Vazio texto="Ainda não há movimentações." />
          )}
        </>
      )}
    </ComDados>
  );
}
