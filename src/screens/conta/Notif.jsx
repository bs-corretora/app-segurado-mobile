import { useNav } from '../../app/nav'
import { NOT } from '../../constants/data'
import { Card } from '../../components'

export function Notif() {
  const { go } = useNav()
  return NOT.map((n) => (
    <Card key={n.t} className="row" onClick={() => go(...n.d)}>
      <div className="col"><b>{n.t}</b><span className="mut">{n.m}</span></div>
      {n.u ? <span className="dot" /> : null}
    </Card>
  ))
}