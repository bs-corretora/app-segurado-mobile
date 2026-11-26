import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { PRODUTO, COBERTURAS, MOTIVO } from '../../constants/rotulos';
import { buscarPerfil, pedirCotacao } from '../../api';
import type { Produto, DadosCotacao, MotivoCotacao } from '../../api';
import { AreaTexto, Aviso, Botao, Campo, Selecao } from '../../components';
import { mascaraTelefone, soDigitos } from '../../utils/formatos';
import { useEnvio } from '../../hooks/useEnvio';
import { useNav } from '../../app/nav';
import {
  obrigatorio,
  opcional,
  textoLivre,
  validadoresPorTipo,
  validarTudo,
} from '../../utils/validacao';

/** Telefone e detalhes são opcionais; preenchidos, precisam estar no formato. */
const TELEFONE = opcional(validadoresPorTipo.telefone);
const DETALHES = opcional(textoLivre(10, 2000));

const ehProduto = (p: string | undefined): p is Produto => !!p && p in PRODUTO;

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
      () => validarTudo({ telefone: [f.telefone, TELEFONE], dados: [f.detalhes, DETALHES] }),
    );
    if (!r) return;
    go('cotacao');
    go('cot-det', r.id);
  };

  return (
    <div className="form-container">
      <form onSubmit={aoEnviar} noValidate className="form-grid">
        <p className="legend-obrigatorio" aria-hidden="true">
          * obrigatório
        </p>
        <div className="card full-width">
          <span className="mut">Produto</span>
          <br />
          <b>{PRODUTO[produto]}</b>
        </div>
        <Selecao
          label="Tipo de pedido"
          value={f.motivo}
          onChange={(v) => muda('motivo')(v as MotivoCotacao)}
          onBlur={(v) => muda('motivo')(v as MotivoCotacao)}
          opcoes={Object.entries(MOTIVO)}
          erro={envio.campos.motivo}
          required
          validar={obrigatorio}
        />
        <Selecao
          label="Tipo de cobertura"
          value={f.cobertura}
          onChange={muda('cobertura')}
          onBlur={muda('cobertura')}
          opcoes={coberturas.map((c) => [c, c] as const)}
          required
          validar={obrigatorio}
        />
        <Campo
          label="Telefone para contato"
          type="tel"
          placeholder="(00) 00000-0000"
          inputMode="tel"
          autoComplete="tel-national"
          value={f.telefone}
          onChange={(v) => muda('telefone')(mascaraTelefone(v))}
          onBlur={(v) => muda('telefone')(mascaraTelefone(v))}
          erro={envio.campos.telefone}
          validar={TELEFONE}
        />
        <AreaTexto
          label="Detalhes do pedido"
          placeholder="Informe o que você precisa"
          value={f.detalhes}
          onChange={muda('detalhes')}
          onBlur={muda('detalhes')}
          erro={envio.campos.dados}
          validar={DETALHES}
          className="full-width"
        />
        {envio.erro && <Aviso tipo="err">{envio.erro}</Aviso>}
        <Botao type="submit" carregando={envio.enviando} className="full-width">
          Enviar pedido
        </Botao>
      </form>
    </div>
  );
}
