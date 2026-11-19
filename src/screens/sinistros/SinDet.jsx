import { Selo } from '../../components'

export function SinDet() {
  return (
    <>
      <div className="card col">
        <div className="row"><b>SIN-2026-000123</b><Selo s="EM_ANALISE" /></div>
        <span className="mut">Colisão · Auto AU-2026-004821</span>
        <span className="mut">Av. Boa Viagem, Recife</span>
      </div>
      <h2>Histórico</h2>
      <div className="tl">
        <div><b>Em análise</b><div className="mut">22/09/2026 · Recebemos seus dados e começamos a análise.</div></div>
        <div><b>Aberto</b><div className="mut">20/09/2026 · Sinistro registrado.</div></div>
      </div>
    </>
  )
}