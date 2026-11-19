import { Card, ComDados, Contato, Icon, Vazio } from '../../components';
import { listarContatos } from '../../api';
import { useApi } from '../../hooks/useApi';
import { useNav } from '../../app/nav';

const DUVIDAS: [pergunta: string, resposta: string][] = [
  [
    'Como abro um sinistro?',
    'Na aba Sinistro, toque em "Abrir sinistro", escolha a apólice e conte o que aconteceu. Você recebe um protocolo e acompanha cada mudança pelo app.',
  ],
  [
    'Onde vejo minha apólice em PDF?',
    'No Início, toque na apólice e depois em "Ver apólice em PDF".',
  ],
  [
    'Como peço uma cotação ou renovação?',
    'Na aba Cotação, toque em "Nova cotação", escolha o seguro e o tipo de pedido. A resposta chega nas notificações.',
  ],
  [
    'Esqueci minha senha. E agora?',
    'Na tela de entrada, toque em "Esqueci minha senha" e siga o link que chega no seu e-mail.',
  ],
];

export function Ajuda() {
  const { go } = useNav();
  const contatos = useApi(() => listarContatos('SINISTRO'));
  return (
    <>
      <Card className="row" onClick={() => go('assistente')}>
        <div>
          <b>Pergunte ao assistente</b>
          <div className="mut">Tire dúvidas sobre suas apólices, sinistros e cotações.</div>
        </div>
        <Icon n="chat" />
      </Card>
      <h2 className="m0">Dúvidas frequentes</h2>
      {DUVIDAS.map(([p, r]) => (
        <details key={p} className="card">
          <summary>{p}</summary>
          <p className="mut">{r}</p>
        </details>
      ))}
      <h2>Fale com a BS Seguros</h2>
      <ComDados r={contatos}>
        {({ itens }) =>
          itens.length ? (
            itens.map((c) => <Contato key={c.id} contato={c} />)
          ) : (
            <Vazio texto="Nenhum contato disponível no momento." />
          )
        }
      </ComDados>
    </>
  );
}
