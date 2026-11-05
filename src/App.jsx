import { NavProvider, useNav, TABS, OUT } from './nav'
import { SCREENS } from './screens'
import { TL, TI, TT } from './data'
import { Icon } from './ui'
import bBranco from './assets/b-branco.png'

const LG = <img className="lg" src={bBranco} alt="BS Seguros" />

function Header() {
  const { cur, go, back } = useNav()
  const [n] = cur
  const tab = TABS.includes(n)
  return (
    <header>
      {tab ? (
        n === 'home' ? (
          <><div className="av">TV</div><b>Thauan Veiga</b></>
        ) : (
          <>{n === 'cotacao' && LG}<b className="t">{TL[n]}</b></>
        )
      ) : (
        <>
          <button onClick={back} aria-label="Voltar"><Icon n="back" /></button>
          {n.startsWith('cot') && LG}
          <b className="t">{TT[n]}</b>
        </>
      )}
      <button className="bl" onClick={() => go('notif')} aria-label="Notificações"><Icon n="bell" /><i>2</i></button>
    </header>
  )
}

function TabBar() {
  const { cur, go } = useNav()
  return (
    <nav>
      {TABS.map((t) => (
        <button key={t} className={t === cur[0] ? 'on' : ''} onClick={() => go(t)}>
          <Icon n={TI[t]} />{TL[t]}
        </button>
      ))}
    </nav>
  )
}

export function Shell() {
  const { cur } = useNav()
  const [n, a] = cur
  const Screen = SCREENS[n]
  return (
    <div id="app">
      {!OUT.includes(n) && <Header />}
      <main key={`${n}-${a}`}><Screen arg={a} /></main>
      {TABS.includes(n) && <TabBar />}
    </div>
  )
}

export default function App() {
  return <NavProvider><Shell /></NavProvider>
}
