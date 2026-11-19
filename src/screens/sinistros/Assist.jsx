import { Contato } from '../../components'

export function Assist() {
  return (
    <>
      <p className="mut" style={{ margin: 0 }}>Acione a assistência 24 horas do seu seguro.</p>
      {['Auto', 'Residencial', 'Vida'].map((p) => <Contato key={p} title={`Assistência 24h — ${p}`} />)}
    </>
  )
}