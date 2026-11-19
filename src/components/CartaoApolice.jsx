import { useNav } from '../app/nav'
import { Card, Selo } from './index'

export function CartaoApolice({ p }) {
  const { go } = useNav()
  return (
    <Card onClick={() => go('apolice', p.id)}>
      <div className="row"><b>{p.p}</b><Selo s={p.s} /></div>
      <div className="mut">Nº {p.n}</div>
      <div className="mut">Vigência {p.v}</div>
    </Card>
  )
}