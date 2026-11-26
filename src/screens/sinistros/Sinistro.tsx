import { Botao, Card, ComDados, Contato, MaisItens, Tag, Vazio } from '../../components';
import { PRODUTO, TIPO_SINISTRO } from '../../constants/rotulos';
import { data } from '../../utils/formatos';
import { listarApolices, listarContatos, listarSinistros } from '../../api';
import { useApi, usePaginado } from '../../hooks/useApi';
import { useNav } from '../../app/nav';

export function Sinistro() {
  const { go } = useNav();
  const contatos = useApi(() => listarContatos('SINISTRO'));
  const apolices = useApi(() => listarApolices({ limite: 50 }));
  const r = usePaginado(listarSinistros);
  const produtoDe = (id: string) => {
    const a = apolices.dados?.itens.find((x) => x.id === id);
    return a ? PRODUTO[a.produto] : null;
  };

  return (
    <>
      <h2 className="m0">Contato de sinistro</h2>
      <ComDados r={contatos}>
        {({ itens }) => (
          <div className="grid-2col">
            {itens.map((c) => (
              <Contato key={c.id} contato={c} />
            ))}
          </div>
        )}
      </ComDados>
      <Botao onClick={() => go('sin-novo')}>Abrir sinistro</Botao>
      <h2>Meus sinistros</h2>
      <ComDados r={r}>
        {(itens) =>
          itens.length ? (
            <>
              <div className="grid-2col">
                {itens.map((s) => (
                  <Card key={s.id} onClick={() => go('sin-det', s.id)}>
                    <div className="row">
                      <b>{s.protocolo}</b>
                      <Tag s={s.status} />
                    </div>
                    <div className="mut">
                      {[TIPO_SINISTRO[s.tipo], produtoDe(s.apolice_id), data(s.data_ocorrencia)]
                        .filter(Boolean)
                        .join(' · ')}
                    </div>
                  </Card>
                ))}
              </div>
              <MaisItens r={r} />
            </>
          ) : (
            <Vazio texto="Você não tem sinistros registrados." />
          )
        }
      </ComDados>
    </>
  );
}
