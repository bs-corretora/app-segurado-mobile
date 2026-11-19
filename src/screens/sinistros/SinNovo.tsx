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
