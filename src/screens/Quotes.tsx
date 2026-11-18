import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import {
  buscarCotacao,
  buscarPerfil,
  listarCotacoes,
  pedirCotacao,
  type Cotacao as CotacaoApi,
  type DadosCotacao,
  type MotivoCotacao,
  type Produto,
} from '../api';
import { useNav } from '../nav';
import { useApi, usePaginado } from '../hooks/useApi';
import { useEnvio } from '../hooks/useEnvio';
import { data, mascaraTelefone, moeda, soDigitos, valorCampoCotacao } from '../formatos';
import { COBERTURAS, MOTIVO, PRODUTO, PRODUTOS, rotuloCampoCotacao } from '../rotulos';
import {
  AreaTexto,
  Aviso,
  Botao,
  Campo,
  Card,
  ComDados,
  Icon,
  KV,
  MaisItens,
  Selecao,
  Tag,
  Vazio,
} from '../ui';

const ehProduto = (p: string | undefined): p is Produto => !!p && p in PRODUTO;

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

export function CotProd() {
  const { go } = useNav();
  return (
    <>
      <p className="mut m0">Qual seguro você quer cotar?</p>
      {PRODUTOS.map((p) => (
        <Card key={p} className="row" onClick={() => go('cot-form', p)}>
          <b>{PRODUTO[p]}</b>
          <Icon n="shield" />
        </Card>
      ))}
    </>
  );
}

export function CotForm({ arg }: { arg?: string }) {
  const { go } = useNav();
  const envio = useEnvio();
  const produto: Produto = ehProduto(arg) ? arg : 'AUTO';
  const coberturas = COBERTURAS[produto];
  const [f, setF] = useState({
    motivo: 'NOVO' as MotivoCotacao,
    cobertura: coberturas[0] ?? '',
    telefone: '',
    detalhes: '',
  });
  const muda =
    <K extends keyof typeof f>(k: K) =>
    (v: (typeof f)[K]) =>
      setF((atual) => ({ ...atual, [k]: v }));

  // Já sugere o telefone do cadastro.
  useEffect(() => {
    let ativo = true;
    buscarPerfil()
      .then((p) => {
        if (ativo && p.telefone)
          setF((atual) =>
            atual.telefone ? atual : { ...atual, telefone: mascaraTelefone(p.telefone!) },
          );
      })
      .catch(() => {});
    return () => {
      ativo = false;
    };
  }, []);

  const aoEnviar = async (e: FormEvent) => {
    e.preventDefault();
    const dados: DadosCotacao = { cobertura: f.cobertura };
    const tel = soDigitos(f.telefone);
    if (tel) dados.telefone = tel;
    if (f.detalhes.trim()) dados.detalhes = f.detalhes.trim();
    const r = await envio.enviar(
      () => pedirCotacao({ produto, motivo: f.motivo, dados }),
      () =>
        tel && tel.length !== 10 && tel.length !== 11
          ? { telefone: 'Informe o telefone com DDD.' }
          : {},
    );
    if (!r) return;
    go('cotacao');
    go('cot-det', r.id);
  };

  return (
    <form onSubmit={aoEnviar} noValidate>
      <div className="card">
        <span className="mut">Produto</span>
        <br />
        <b>{PRODUTO[produto]}</b>
      </div>
      <Selecao
        label="Tipo de pedido"
        value={f.motivo}
        onChange={(v) => muda('motivo')(v as MotivoCotacao)}
        opcoes={Object.entries(MOTIVO)}
        erro={envio.campos.motivo}
      />
      <Selecao
        label="Tipo de cobertura"
        value={f.cobertura}
        onChange={muda('cobertura')}
        opcoes={coberturas.map((c) => [c, c] as const)}
      />
      <Campo
        label="Telefone para contato"
        type="tel"
        placeholder="(00) 00000-0000"
        inputMode="tel"
        autoComplete="tel-national"
        value={f.telefone}
        onChange={(v) => muda('telefone')(mascaraTelefone(v))}
        erro={envio.campos.telefone}
      />
      <AreaTexto
        label="Detalhes do pedido"
        placeholder="Informe o que você precisa"
        value={f.detalhes}
        onChange={muda('detalhes')}
        erro={envio.campos.dados}
      />
      {envio.erro && <Aviso tipo="err">{envio.erro}</Aviso>}
      <Botao type="submit" carregando={envio.enviando}>
        Enviar pedido
      </Botao>
    </form>
  );
}

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
