import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  abrirSinistro,
  buscarApolice,
  buscarSinistro,
  listarApolices,
  listarContatos,
  listarSinistros,
  type ApoliceResumo,
  type Contato as ContatoApi,
  type TipoSinistro,
} from '../api';
import { useNav } from '../nav';
import { useSessao } from '../sessao';
import { useApi, usePaginado } from '../hooks/useApi';
import { useEnvio } from '../hooks/useEnvio';
import { data, dataHora, paraInputDataHora } from '../formatos';
import { PRODUTO, STATUS, TIPO_SINISTRO } from '../rotulos';
import {
  AreaTexto,
  Aviso,
  Botao,
  Campo,
  Card,
  ComDados,
  Contato,
  KV,
  MaisItens,
  Selecao,
  Tag,
  Vazio,
} from '../ui';

const rotuloApolice = (a: ApoliceResumo) => `${PRODUTO[a.produto]} — ${a.numero}`;

/** Contatos de assistência 24h; os dos produtos que a pessoa tem aparecem primeiro. */
export function Assist() {
  const { resumo } = useSessao();
  const r = useApi(() => listarContatos('ASSISTENCIA_24H'));
  const meus = new Set(resumo?.apolices_ativas.map((a) => a.produto));
  const ordem = (c: ContatoApi) => (c.produto && meus.has(c.produto) ? 0 : 1);
  return (
    <>
      <p className="mut m0">Acione a assistência 24 horas do seu seguro.</p>
      <ComDados r={r}>
        {({ itens }) =>
          itens.length ? (
            [...itens]
              .sort((a, b) => ordem(a) - ordem(b))
              .map((c) => <Contato key={c.id} contato={c} />)
          ) : (
            <Vazio texto="Nenhum contato de assistência disponível no momento." />
          )
        }
      </ComDados>
    </>
  );
}

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
        {({ itens }) => itens.map((c) => <Contato key={c.id} contato={c} />)}
      </ComDados>
      <Botao onClick={() => go('sin-novo')}>Abrir sinistro</Botao>
      <h2>Meus sinistros</h2>
      <ComDados r={r}>
        {(itens) =>
          itens.length ? (
            <>
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

export function SinNovo() {
  const { go } = useNav();
  const apolices = useApi(() => listarApolices({ limite: 50 }));
  const envio = useEnvio();
  const [f, setF] = useState({
    apolice_id: '',
    tipo: 'COLISAO' as TipoSinistro,
    quando: '',
    local: '',
    descricao: '',
  });
  const muda =
    <K extends keyof typeof f>(k: K) =>
    (v: (typeof f)[K]) =>
      setF((atual) => ({ ...atual, [k]: v }));
  const agora = paraInputDataHora(new Date());

  return (
    <ComDados r={apolices}>
      {({ itens }) => {
        const ativas = itens.filter((a) => a.status === 'ATIVA');
        if (!ativas.length)
          return (
            <Vazio texto="Para abrir um sinistro pelo app é preciso ter uma apólice ativa. Fale com a nossa equipe de sinistros.">
              <Botao variante="sec" onClick={() => go('sinistro')}>
                Ver contatos de sinistro
              </Botao>
            </Vazio>
          );
        const apolice_id = f.apolice_id || ativas[0]!.id;

        const aoEnviar = async (e: FormEvent) => {
          e.preventDefault();
          const r = await envio.enviar(
            () =>
              abrirSinistro({
                apolice_id,
                tipo: f.tipo,
                data_ocorrencia: new Date(f.quando).toISOString(),
                local: f.local.trim() || undefined,
                descricao: f.descricao.trim() || undefined,
              }),
            () => {
              const quando = new Date(f.quando);
              if (!f.quando || Number.isNaN(quando.getTime()))
                return { data_ocorrencia: 'Informe a data e a hora.' };
              if (quando > new Date()) return { data_ocorrencia: 'A data não pode ser no futuro.' };
              return {};
            },
          );
          if (!r) return;
          go('sinistro');
          go('sin-ok', r.id);
        };

        return (
          <form onSubmit={aoEnviar} noValidate>
            <Selecao
              label="Apólice"
              value={apolice_id}
              onChange={muda('apolice_id')}
              opcoes={ativas.map((a) => [a.id, rotuloApolice(a)] as const)}
              erro={envio.campos.apolice_id}
            />
            <Selecao
              label="Tipo de sinistro"
              value={f.tipo}
              onChange={(v) => muda('tipo')(v as TipoSinistro)}
              opcoes={Object.entries(TIPO_SINISTRO)}
              erro={envio.campos.tipo}
            />
            <Campo
              label="Data e hora da ocorrência"
              type="datetime-local"
              max={agora}
              value={f.quando}
              onChange={muda('quando')}
              erro={envio.campos.data_ocorrencia}
            />
            <Campo
              label="Local"
              placeholder="Onde aconteceu"
              value={f.local}
              onChange={muda('local')}
              erro={envio.campos.local}
            />
            <AreaTexto
              label="Descrição"
              placeholder="Conte o que aconteceu"
              value={f.descricao}
              onChange={muda('descricao')}
              erro={envio.campos.descricao}
            />
            {envio.erro && <Aviso tipo="err">{envio.erro}</Aviso>}
            <Botao type="submit" carregando={envio.enviando}>
              Abrir sinistro
            </Botao>
          </form>
        );
      }}
    </ComDados>
  );
}

export function SinOk({ arg }: { arg?: string }) {
  const { go, replace } = useNav();
  const id = arg ?? '';
  const r = useApi(() => buscarSinistro(id), [id]);
  return (
    <>
      <div className="card col tc">
        <b className="ok">Sinistro aberto</b>
        <span className="mut">Seu protocolo</span>
        <div className="big">{r.dados?.protocolo ?? '…'}</div>
        <span className="mut">
          Acompanhe o andamento por aqui. Cada mudança aparece nas notificações.
        </span>
      </div>
      <Botao onClick={() => replace('sin-det', id)}>Acompanhar sinistro</Botao>
      <Botao variante="out" onClick={() => go('sinistro')}>
        Voltar
      </Botao>
    </>
  );
}

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
