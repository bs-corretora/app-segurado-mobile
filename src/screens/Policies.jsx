import { useNav } from '../nav'
import { POL } from '../data'
import { PolicyCard, Tag } from '../ui'

export const Apolices = () => POL.map((p) => <PolicyCard key={p.id} p={p} />)

export function Apolice({ arg }) {
  const { go } = useNav()
  const p = POL[arg]
  return (
    <>
      <div className="card col">
        <div className="row"><h1>{p.p}</h1><Tag s={p.s} /></div>
        <span className="mut">Número</span><b>{p.n}</b>
        <span className="mut">Vigência</span><b>{p.v}</b>
        <span className="mut">Prêmio</span><b>{p.pr}</b>
      </div>
      <button className="btn" onClick={() => go('pdf', arg)}>Visualizar PDF</button>
      <button className="btn out" onClick={() => alert('Download iniciado (protótipo)')}>Baixar PDF</button>
    </>
  )
}

export function Pdf({ arg }) {
  const w = ['100%', '100%', '70%', '100%', '85%', '100%', '60%', '100%', '100%', '75%']
  return (
    <>
      <div className="pdf"><b>Apólice {POL[arg].n}</b>{w.map((x, i) => <i key={i} style={{ width: x }} />)}</div>
      <button className="btn" onClick={() => alert('Download iniciado (protótipo)')}>Baixar PDF</button>
    </>
  )
}
