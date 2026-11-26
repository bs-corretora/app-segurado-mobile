import { useEffect } from 'react';
import { quandoSessaoAcabar } from '../api';
import { NavProvider, OUT, TABS, ehAba, useNav } from './nav';
import type { Rota } from './nav';
import { SessaoProvider, useSessao } from './sessao';
import { SCREENS } from '../screens';
import { ICONE_ABA, ROTULO_ABA, TITULO } from '../constants/rotulos';
import { Avatar, Icon, type NomeIcone } from '../components';
import { useOnline } from '../hooks/useOnline';
import { atualizarApp, useNovaVersao } from '../pwa/atualizacao';
import bBranco from '../assets/b-branco.png';

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

function Sidebar() {
  const { cur, go } = useNav();
  const { resumo } = useSessao();
  const [n] = cur;

  const navItems = [
    { id: 'home', label: 'Início', icon: 'home' as NomeIcone },
    { id: 'cotacao', label: 'Cotação', icon: 'request_quote' as NomeIcone },
    { id: 'sinistro', label: 'Sinistros', icon: 'assignment' as NomeIcone },
    { id: 'assist', label: 'Assistência', icon: 'support_agent' as NomeIcone },
    { id: 'config', label: 'Configurações', icon: 'settings' as NomeIcone },
  ];

  return (
    <aside className="sidebar" aria-label="Navegação principal">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Icon n="security" />
          BS Seguros
        </div>
      </div>
      <nav className="sidebar-nav" aria-label="Menu principal">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-nav-item ${n === item.id ? 'active' : ''}`}
            onClick={() => go(item.id)}
            aria-current={n === item.id ? 'page' : undefined}
          >
            <Icon n={item.icon} className="ic" />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{resumo?.iniciais ?? ''}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{resumo?.nome ?? ''}</div>
            <div className="sidebar-user-role">Segurado BS</div>
          </div>
        </div>
        {/* Botão Assistente Global no Desktop */}
        <button
          className="assistente-global-btn"
          onClick={() => go('assistente')}
          aria-label="Abrir Assistente Virtual"
        >
          <Icon n="chat" className="ic" />
          Assistente
        </button>
      </div>
    </aside>
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
    <div id="app" className={comCabecalho ? 'com-menu' : undefined}>
      {comCabecalho && <Sidebar />}
      {comCabecalho && <Header />}
      <Faixas />
      <main key={`${n}-${a ?? ''}`} className={comCabecalho ? '' : 'fora'}>
        <Screen arg={a} />
      </main>
      {ehAba(n) && <TabBar />}
      {/* FAB Assistente Global (Mobile): só com o app aberto e fora da própria conversa */}
      {comCabecalho && n !== 'assistente' && (
        <button
          className={`fab-assistente ${ehAba(n) ? '' : 'sem-abas'}`}
          onClick={() => go('assistente')}
          aria-label="Abrir Assistente Virtual"
        >
          <Icon n="chat" className="ic" />
        </button>
      )}
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
