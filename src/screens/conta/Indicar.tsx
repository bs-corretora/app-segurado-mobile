import { useState } from 'react';
import { Aviso, Botao, ComDados, MaisItens, Tag, Vazio } from '../../components';
import { buscarLinkIndicacao, listarIndicacoes } from '../../api';
import { data } from '../../utils/formatos';
import { useApi, usePaginado } from '../../hooks/useApi';

/** Copia para a área de transferência; devolve `false` se o navegador não deixar. */
async function copiar(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    return false;
  }
}

export function Indicar() {
  const link = useApi(buscarLinkIndicacao);
  const r = usePaginado(listarIndicacoes);
  const [aviso, setAviso] = useState<string | null>(null);

  const aoCopiar = async (url: string) =>
    setAviso(
      (await copiar(url)) ? 'Link copiado.' : 'Não deu para copiar. Selecione o link acima.',
    );

  const aoCompartilhar = async (url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BS Seguros',
          text: 'Faça sua cotação de seguro com a BS Seguros:',
          url,
        });
      } catch {
        // A pessoa fechou o compartilhamento: nada a fazer.
      }
      return;
    }
    await aoCopiar(url);
  };

  return (
    <>
      <ComDados r={link}>
        {({ link: url, codigo }) => (
          <div className="card col">
            <span className="mut">Seu link de indicação</span>
            <b className="quebra">{url}</b>
            <span className="mut">Código: {codigo}</span>
            <div className="btns mt">
              <Botao variante="sec" onClick={() => void aoCopiar(url)}>
                Copiar
              </Botao>
              <Botao onClick={() => void aoCompartilhar(url)}>Compartilhar</Botao>
            </div>
            {aviso && <Aviso tipo="ok">{aviso}</Aviso>}
          </div>
        )}
      </ComDados>
      <h2>Minhas indicações</h2>
      <ComDados r={r}>
        {(itens) =>
          itens.length ? (
            <>
              {itens.map((i) => (
                <div key={i.id} className="card row">
                  <div className="col">
                    <b>{i.nome}</b>
                    <span className="mut">{data(i.criado_em)}</span>
                  </div>
                  <Tag s={i.status} />
                </div>
              ))}
              <MaisItens r={r} />
            </>
          ) : (
            <Vazio texto="Quem fizer cotação pelo seu link aparece aqui." />
          )
        }
      </ComDados>
    </>
  );
}
