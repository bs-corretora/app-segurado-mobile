import { useEffect } from 'react';
import { quandoSessaoAcabar } from './api';
import { NavProvider, OUT, TABS, ehAba, useNav } from './nav';
import type { Rota } from './nav';
import { SessaoProvider, useSessao } from './sessao';
import { SCREENS } from './screens';
import { ICONE_ABA, ROTULO_ABA, TITULO } from './rotulos';
import { Avatar, Icon } from './ui';
import { useOnline } from './hooks/useOnline';
import { atualizarApp, useNovaVersao } from './pwa/atualizacao';
import bBranco from './assets/b-branco.png';

/** Telas sem cabeçalho nem abas. */
const SEM_CABECALHO: readonly string[] = [...OUT, 'boas'];

const LG = <img className="lg" src={bBranco} alt="BS Seguros" />;

function Header() {
  const { cur, go, back } = useNav();
  const { resumo } = useSessao();
  const [n] = cur;
  const naoLidas = resumo?.nao_lidas ?? 0;
  return (
    <header>
      {ehAba(n) ? (
        n === 'home' ? (
          <>
            <Avatar texto={resumo?.iniciais ?? ''} />
            <b>{resumo?.nome ?? ''}</b>
          </>
        ) : (
          <>
            {n === 'cotacao' && LG}
            <b className="t">{ROTULO_ABA[n]}</b>
          </>
        )
      ) : (
        <>
          <button onClick={back} aria-label="Voltar">
            <Icon n="back" />
          </button>
          {n.startsWith('cot') && LG}
          <b className="t">{TITULO[n] ?? ''}</b>
        </>
      )}
      <button
        className="bl"
        onClick={() => go('notif')}
        aria-label={naoLidas ? `Notificações, ${naoLidas} não lidas` : 'Notificações'}
      >
        <Icon n="bell" />
        {naoLidas > 0 && <i aria-hidden="true">{naoLidas > 9 ? '9+' : naoLidas}</i>}
      </button>
    </header>
  );
}

function TabBar() {
  const { cur, go } = useNav();
  return (
    <nav aria-label="Seções do app">
      {TABS.map((t) => (
        <button
          key={t}
          className={t === cur[0] ? 'on' : ''}
          aria-current={t === cur[0] ? 'page' : undefined}
          onClick={() => go(t)}
        >
          <Icon n={ICONE_ABA[t]} />
          {ROTULO_ABA[t]}
        </button>
      ))}
    </nav>
  );
}

function Faixas() {
  const online = useOnline();
  const novaVersao = useNovaVersao();
  return (
    <>
      {!online && (
        <div className="faixa off" role="status">
          Sem internet. Algumas informações podem não carregar.
        </div>
      )}
      {novaVersao && (
        <div className="faixa nova" role="status">
          <span>Nova versão do app disponível.</span>
          <button onClick={atualizarApp}>Atualizar</button>
        </div>
      )}
    </>
  );
}

export function Shell() {
  const { cur, go } = useNav();
  const { limpar } = useSessao();
  const [n, a] = cur;
  const Screen = SCREENS[n] ?? SCREENS.home!;
  const comCabecalho = !SEM_CABECALHO.includes(n);

  // Sessão vencida (refresh recusado): volta ao login de qualquer tela.
  useEffect(
    () =>
      quandoSessaoAcabar(() => {
        limpar();
        go('login');
      }),
    [go, limpar],
  );

  useEffect(() => {
    const titulo = ehAba(n) ? ROTULO_ABA[n] : TITULO[n];
    document.title = titulo ? `${titulo} · BS Seguros` : 'BS Seguros — App do Segurado';
  }, [n]);

  return (
    <div id="app">
      {comCabecalho && <Header />}
      <Faixas />
      <main key={`${n}-${a ?? ''}`} className={comCabecalho ? '' : 'fora'}>
        <Screen arg={a} />
      </main>
      {ehAba(n) && <TabBar />}
    </div>
  );
}

/** Raiz do app; `start` só muda nos testes. */
export function Raiz({ start }: { start?: Rota }) {
  return (
    <NavProvider start={start}>
      <SessaoProvider>
        <Shell />
      </SessaoProvider>
    </NavProvider>
  );
}

export default function App() {
  return <Raiz />;
}
