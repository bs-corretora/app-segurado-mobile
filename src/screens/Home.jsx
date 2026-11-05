import { useNav } from '../nav'
import { POL } from '../data'
import { Card, Icon, PolicyCard } from '../ui'

export function Home() {
  const { go, bday, setBday } = useNav()
  const atalhos = [['assist', 'phone', 'Assistência 24h'], ['sinistro', 'alert', 'Sinistro'], ['cotacao', 'quote', 'Cotação']]
  return (
    <>
      {bday && (
        <div className="card ban row">
          <div><b>Feliz Aniversário, Thauan!</b><div className="mut">A BS Seguros deseja um dia especial.</div></div>
          <button className="mut" style={{ background: 'none', border: 0, fontSize: 20 }} aria-label="Fechar" onClick={() => setBday(false)}>×</button>
        </div>
      )}
      <div className="card hero"><div className="big">3 anos e 4 meses</div><small>como segurado da BS Seguros</small></div>
      <h2>Minhas apólices ativas</h2>
      {POL.filter((p) => p.s === 'ATIVA').map((p) => <PolicyCard key={p.id} p={p} />)}
      <button className="btn sec" onClick={() => go('apolices')}>Ver todas as apólices</button>
      <h2>Acesso rápido</h2>
      <div className="grid3">
        {atalhos.map(([t, i, l]) => <Card key={t} className="sh" onClick={() => go(t)}><Icon n={i} />{l}</Card>)}
      </div>
      <div className="card ban row">
        <div><b>Indique amigos</b><div className="mut">Convide conhecidos para cotar na BS Seguros.</div></div>
        <button className="btn" style={{ width: 'auto', padding: '10px 16px' }} onClick={() => go('indicar')}>Indicar</button>
      </div>
    </>
  )
}
