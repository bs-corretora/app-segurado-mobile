import { useState } from 'react';
import { listarNotificacoes, marcarNotificacaoLida } from '../../api';
import type { Notificacao } from '../../api';
import { Card, ComDados, MaisItens, Vazio } from '../../components';
import { dataHora } from '../../utils/formatos';
import { useNav } from '../../app/nav';
import { usePaginado } from '../../hooks/useApi';
import { useSessao } from '../../app/sessao';

const DESTINO: Record<NonNullable<Notificacao['destino_tipo']>, string> = {
  SINISTRO: 'sin-det',
  COTACAO: 'cot-det',
  APOLICE: 'apolice',
};

export function Notif() {
  const { go } = useNav();
  const { descontarLida } = useSessao();
  const r = usePaginado(listarNotificacoes);
  const [lidasAgora, setLidasAgora] = useState<Set<string>>(() => new Set());
  const naoLida = (n: Notificacao) => !n.lida_em && !lidasAgora.has(n.id);

  const abrir = (n: Notificacao) => {
    if (naoLida(n)) {
      setLidasAgora((s) => new Set(s).add(n.id));
      descontarLida();
      marcarNotificacaoLida(n.id).catch(() => {});
    }
    if (n.destino_tipo && n.destino_id) go(DESTINO[n.destino_tipo], n.destino_id);
  };

  return (
    <ComDados r={r}>
      {(itens) =>
        itens.length ? (
          <>
            {itens.map((n) => (
              <Card
                key={n.id}
                className={`row ${naoLida(n) ? 'nl' : ''}`}
                onClick={() => abrir(n)}
                aria-label={`${naoLida(n) ? 'Não lida: ' : ''}${n.titulo}`}
              >
                <div className="col">
                  <b>{n.titulo}</b>
                  <span>{n.mensagem}</span>
                  <span className="mut">{dataHora(n.criado_em)}</span>
                </div>
                {naoLida(n) && <span className="dot" />}
              </Card>
            ))}
            <MaisItens r={r} />
          </>
        ) : (
          <Vazio texto="Nenhuma notificação por enquanto." />
        )
      }
    </ComDados>
  );
}
