import { useState } from 'react';
import type { FormEvent } from 'react';
import { AreaTexto, Aviso, Botao, Campo, ComDados, Selecao, Vazio } from '../../components';
import { TIPO_SINISTRO } from '../../constants/rotulos';
import { abrirSinistro, listarApolices } from '../../api';
import type { TipoSinistro } from '../../api';
import { paraInputDataHora } from '../../utils/formatos';
import { rotuloApolice } from '../../utils/rotuloApolice';
import { useApi } from '../../hooks/useApi';
import { useEnvio } from '../../hooks/useEnvio';
import { useNav } from '../../app/nav';
import { validadoresPorTipo, compor, obrigatorio, textoLivre } from '../../utils/validacao';

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
          <div className="form-container">
            <form onSubmit={aoEnviar} noValidate className="form-grid">
              <p className="legend-obrigatorio" aria-hidden="true">
                * obrigatório
              </p>
              <Selecao
                label="Apólice"
                value={apolice_id}
                onChange={muda('apolice_id')}
                onBlur={muda('apolice_id')}
                opcoes={ativas.map((a) => [a.id, rotuloApolice(a)] as const)}
                erro={envio.campos.apolice_id}
                required
                validar={obrigatorio}
              />
              <Selecao
                label={
                  <span
                    className="tooltip"
                    data-tooltip="Tipo de evento: Colisão, Roubo ou furto, Incêndio, Dano elétrico ou Outro."
                  >
                    Tipo de sinistro
                  </span>
                }
                value={f.tipo}
                onChange={(v) => muda('tipo')(v as TipoSinistro)}
                onBlur={(v) => muda('tipo')(v as TipoSinistro)}
                opcoes={Object.entries(TIPO_SINISTRO)}
                erro={envio.campos.tipo}
                required
                validar={obrigatorio}
              />
              <Campo
                label={
                  <span className="tooltip" data-tooltip="Data e hora em que o sinistro ocorreu.">
                    Data e hora da ocorrência
                  </span>
                }
                type="datetime-local"
                max={agora}
                value={f.quando}
                onChange={muda('quando')}
                onBlur={muda('quando')}
                erro={envio.campos.data_ocorrencia}
                required
                validar={validadoresPorTipo.dataNaoFutura}
              />
              <Campo
                label="Local"
                placeholder="Onde aconteceu"
                value={f.local}
                onChange={muda('local')}
                onBlur={muda('local')}
                erro={envio.campos.local}
                required
                validar={compor(obrigatorio, textoLivre(3, 200))}
              />
              <AreaTexto
                label="Descrição"
                placeholder="Conte o que aconteceu"
                value={f.descricao}
                onChange={muda('descricao')}
                onBlur={muda('descricao')}
                erro={envio.campos.descricao}
                required
                validar={compor(obrigatorio, textoLivre(10, 2000))}
                className="full-width"
              />
              {envio.erro && <Aviso tipo="err">{envio.erro}</Aviso>}
              <Botao type="submit" carregando={envio.enviando} className="full-width">
                Abrir sinistro
              </Botao>
            </form>
          </div>
        );
      }}
    </ComDados>
  );
}
