import { Card } from '../../components'

export function Indicar() {
  return (
    <>
      <div className="card col">
        <span className="mut">Seu link de indicação</span>
        <b>bsseguros.com/i/TV8K2Q</b>
        <div className="btns" style={{ marginTop: 8 }}>
          <button className="btn sec" onClick={() => alert('Link copiado (protótipo)')}>Copiar</button>
          <button className="btn" onClick={() => alert('Compartilhar (protótipo)')}>Compartilhar</button>
        </div>
      </div>
      <h2>Minhas indicações</h2>
      {[['Carla Mendes', 'CONVERTIDA'], ['Rafael Lima', 'CONTATADA'], ['Bruna Alves', 'NOVA']].map(([n, s]) => (
        <div key={n} className="card row"><b>{n}</b><span className="tag">{s === 'CONVERTIDA' ? 'ok' : s === 'CONTATADA' ? 'warn' : 'warn'}</span></div>
      ))}
    </>
  )
}