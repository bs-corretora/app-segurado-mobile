import { useEffect, useState } from 'react';
import { paraInputDataHora, primeiroNome, tempoDeCasa } from '../../utils/formatos';
import { Botao, Card, Carregando, CartaoApolice, Erro, Icon, Vazio } from '../../components';
import type { NomeIcone } from '../../components';
import { useNav } from '../../app/nav';
import { useSessao } from '../../app/sessao';

const CHAVE_ANIVERSARIO = 'aniversario-fechado';

const hoje = () => paraInputDataHora(new Date()).slice(0, 10);

function aniversarioFechadoHoje(): boolean {
  try {
    return localStorage.getItem(CHAVE_ANIVERSARIO) === hoje();
  } catch {
    return false;
  }
}

const ATALHOS: [tela: string, icone: NomeIcone, texto: string][] = [
  ['assist', 'phone', 'Assistência 24h'],
  ['sinistro', 'alert', 'Sinistro'],
  ['cotacao', 'quote', 'Cotação'],
];

export function Inicio() {
  const { go } = useNav();
  const { resumo, erro, atualizar } = useSessao();
  const [fechouAniversario, setFechouAniversario] = useState(aniversarioFechadoHoje);

  // Ao entrar no início, traz o resumo atualizado (apólices e o sininho).
  useEffect(() => {
    void atualizar();
  }, [atualizar]);

  if (!resumo) {
    return erro ? <Erro mensagem={erro} aoTentar={() => void atualizar()} /> : <Carregando />;
  }

  const fecharAniversario = () => {
    setFechouAniversario(true);
    try {
      localStorage.setItem(CHAVE_ANIVERSARIO, hoje());
    } catch {
      // Sem armazenamento (aba anônima): o aviso só some até recarregar.
    }
  };
  const tempo = tempoDeCasa(resumo.tempo_de_casa);

  return (
    <>
      {resumo.aniversario_hoje && !fechouAniversario && (
        <div className="card ban row">
          <div>
            <b>Feliz aniversário, {primeiroNome(resumo.nome)}!</b>
            <div className="mut">A BS Seguros deseja um dia especial.</div>
          </div>
          <button
            className="x"
            aria-label="Fechar aviso de aniversário"
            onClick={fecharAniversario}
          >
            <Icon n="close" />
          </button>
        </div>
      )}
      <div className="card hero">
        {tempo ? (
          <>
            <div className="big">{tempo}</div>
            <small>como segurado da BS Seguros</small>
          </>
        ) : (
          <>
            <div className="big">Boas-vindas!</div>
            <small>Que bom ter você na BS Seguros</small>
          </>
        )}
      </div>
      <h2>Minhas apólices ativas</h2>
      {resumo.apolices_ativas.length ? (
        <div className="grid-responsive">
          {resumo.apolices_ativas.map((a) => <CartaoApolice key={a.id} a={a} />)}
        </div>
      ) : (
        <Vazio texto="Você não tem apólice ativa no momento.">
          <Botao variante="sec" onClick={() => go('cot-prod')}>
            Fazer uma cotação
          </Botao>
        </Vazio>
      )}
      <Botao variante="sec" onClick={() => go('apolices')}>
        Ver todas as apólices
      </Botao>
      <h2>Acesso rápido</h2>
      <div className="grid-3col">
        {ATALHOS.map(([t, i, l]) => (
          <Card key={t} className="sh" onClick={() => go(t)}>
            <Icon n={i} />
            {l}
          </Card>
        ))}
      </div>
      <div className="card ban row">
        <div>
          <b>Tire suas dúvidas</b>
          <div className="mut">Pergunte ao assistente sobre apólices, sinistros e cotações.</div>
        </div>
        <button className="btn auto" onClick={() => go('assistente')}>
          Perguntar
        </button>
      </div>
      <div className="card ban row">
        <div>
          <b>Indique amigos</b>
          <div className="mut">Convide conhecidos para cotar na BS Seguros.</div>
        </div>
        <button className="btn auto" onClick={() => go('indicar')}>
          Indicar
        </button>
      </div>
    </>
  );
}
