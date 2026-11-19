import { useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { Erro, Icon } from '../../components';
import { MAX_TEXTO, useConversa } from '../../hooks/useConversa';
import type { MensagemConversa } from '../../hooks/useConversa';
import { destinoDoAtalho } from '../../utils/destinoAtalho';
import { useNav } from '../../app/nav';
import { trechosDoAssistente } from '../../utils/textoAssistente';

const SUGESTOES = [
  'Quando vence minha apólice?',
  'Como abro um sinistro?',
  'Em que pé está minha cotação?',
];

function Balao({ m }: { m: MensagemConversa }) {
  const { go } = useNav();
  if (m.papel === 'usuario') return <div className="balao eu">{m.texto}</div>;

  const atalhos = (m.atalhos ?? []).flatMap((a) => {
    const destino = destinoDoAtalho(a);
    return destino ? [{ rotulo: a.rotulo, destino }] : [];
  });
  const fontes = m.fontes ?? [];
  return (
    <div className="balao ia">
      <span className="quebra">
        {trechosDoAssistente(m.texto).map((t, i) =>
          t.negrito ? <strong key={i}>{t.texto}</strong> : <span key={i}>{t.texto}</span>,
        )}
      </span>
      {atalhos.length > 0 && (
        <div className="atalhos">
          {atalhos.map(({ rotulo, destino: [tela, arg] }) => (
            <button key={`${tela}-${arg ?? ''}-${rotulo}`} onClick={() => go(tela, arg)}>
              {rotulo}
              <Icon n="next" />
            </button>
          ))}
        </div>
      )}
      {fontes.length > 0 && (
        <small className="fontes">Fontes: {fontes.map((f) => f.titulo).join(' · ')}</small>
      )}
    </div>
  );
}

export function Assistente() {
  const { mensagens, esperando, erro, enviar, tentarDeNovo } = useConversa();
  const [texto, setTexto] = useState('');
  const fim = useRef<HTMLDivElement>(null);

  // Rola até a última mensagem (ou o "digitando", ou o erro) sempre que algo chega.
  useEffect(() => {
    fim.current?.scrollIntoView({ block: 'end' });
  }, [mensagens.length, esperando, erro]);

  const perguntar = (t: string) => {
    if (!t.trim() || esperando) return;
    setTexto('');
    void enviar(t);
  };
  const aoEnviar = (e: FormEvent) => {
    e.preventDefault();
    perguntar(texto);
  };
  // Enter envia; Shift+Enter quebra a linha.
  const aoTeclar = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      perguntar(texto);
    }
  };

  return (
    <>
      <div className="chat" aria-live="polite">
        {mensagens.length === 0 && (
          <div className="chat-vazio">
            <b>Como posso ajudar?</b>
            <span className="mut">
              Pergunte sobre suas apólices, sinistros e cotações. Algumas sugestões:
            </span>
            {SUGESTOES.map((s) => (
              <button key={s} className="sugestao" onClick={() => perguntar(s)}>
                {s}
              </button>
            ))}
          </div>
        )}
        {mensagens.map((m) => (
          <Balao key={m.id} m={m} />
        ))}
        {esperando && (
          <div className="balao ia digitando" role="status">
            Digitando…
          </div>
        )}
        {erro && (
          <Erro
            titulo="Não deu para responder"
            mensagem={erro}
            aoTentar={() => void tentarDeNovo()}
          />
        )}
        <div ref={fim} />
      </div>
      <div className="chat-rodape">
        <form className="chat-envio" onSubmit={aoEnviar}>
          <textarea
            aria-label="Sua pergunta"
            placeholder="Escreva sua pergunta"
            rows={1}
            value={texto}
            maxLength={MAX_TEXTO}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={aoTeclar}
          />
          <button type="submit" aria-label="Enviar pergunta" disabled={!texto.trim() || esperando}>
            <Icon n="send" />
          </button>
        </form>
        <small className="mut">
          Respostas geradas por IA podem conter erros. Em caso de dúvida, fale com a corretora.
        </small>
      </div>
    </>
  );
}
