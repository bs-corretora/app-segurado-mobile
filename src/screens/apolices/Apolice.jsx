import { useNav } from '../../app/nav'
import { POL } from '../../constants/data'
import { Selo } from '../../components'

export function Apolice({ arg }) {
  const { go } = useNav()
  const p = POL[arg]
  return (
    <>
      <div className="card col">
        <div className="row"><h1>{p.p}</h1><Selo s={p.s} /></div>
        <span className="mut">Número</span><b>{p.n}</b>
        <span className="mut">Vigência</span><b>{p.v}</b>
        <span className="mut">Prêmio</span><b>{p.pr}</b>
      </div>
      <button className="btn" onClick={() => go('pdf', arg)}>Visualizar PDF</button>
      <button className="btn out" onClick={() => alert('Download iniciado (protótipo)')}>Baixar PDF</button>
    </>
  )
}