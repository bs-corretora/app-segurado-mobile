import { POL } from '../../constants/data'

export function Pdf({ arg }) {
  const w = ['100%', '100%', '70%', '100%', '85%', '100%', '60%', '100%', '100%', '75%']
  return (
    <>
      <div className="pdf"><b>Apólice {POL[arg].n}</b>{w.map((x, i) => <i key={i} style={{ width: x }} />)}</div>
      <button className="btn" onClick={() => alert('Download iniciado (protótipo)')}>Baixar PDF</button>
    </>
  )
}