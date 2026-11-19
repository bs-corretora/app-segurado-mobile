import { useState } from 'react';
import { linkPdfApolice, buscarApolice } from '../../api';
import { Aviso, Botao, ComDados, KV, Tag } from '../../components';
import { PRODUTO } from '../../constants/rotulos';
import { data, moeda } from '../../utils/formatos';
import { useApi } from '../../hooks/useApi';
import { useEnvio } from '../../hooks/useEnvio';

/**
 * Abre o PDF da apólice. O link vale 60 segundos, então é pedido na hora do toque.
 * A aba nova é aberta ANTES do `await`: depois dele, o Safari do iPhone bloqueia a janela.
 * Se nem assim abrir (bloqueador de pop-up), o app navega para o PDF na mesma aba.
 */
async function abrirPdf(id: string): Promise<void> {
  const janela = window.open('', '_blank');
  // A página do PDF não precisa (nem deve) controlar o app que a abriu.
  if (janela) janela.opener = null;
  try {
    const { url } = await linkPdfApolice(id);
    if (janela && !janela.closed) janela.location.href = url;
    else window.location.href = url;
  } catch (e) {
    janela?.close();
    throw e;
  }
}

export function Apolice({ arg }: { arg?: string }) {
  const id = arg ?? '';
  const r = useApi(() => buscarApolice(id), [id]);
  const envio = useEnvio();
  const [abriu, setAbriu] = useState(false);

  const verPdf = async () => {
    setAbriu(false);
    const ok = await envio.enviar(async () => {
      await abrirPdf(id);
      return true;
    });
    if (ok) setAbriu(true);
  };

  return (
    <ComDados r={r}>
      {(a) => (
        <>
          <div className="card col">
            <div className="row">
              <h1>{PRODUTO[a.produto]}</h1>
              <Tag s={a.status} />
            </div>
            <KV k="Número" v={a.numero} />
            <KV k="Início da vigência" v={data(a.inicio_vigencia)} />
            <KV k="Fim da vigência" v={data(a.fim_vigencia)} />
            <KV k="Prêmio" v={moeda(a.premio)} />
          </div>
          {envio.erro && (
            <Aviso tipo="err">
              {envio.erro.startsWith('Não encontramos')
                ? 'O PDF desta apólice ainda não está disponível.'
                : envio.erro}
            </Aviso>
          )}
          {abriu && <Aviso tipo="ok">O PDF foi aberto em outra aba.</Aviso>}
          <Botao carregando={envio.enviando} onClick={() => void verPdf()}>
            Ver apólice em PDF
          </Botao>
        </>
      )}
    </ComDados>
  );
}
