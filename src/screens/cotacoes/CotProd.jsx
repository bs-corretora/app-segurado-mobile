import { useNav } from '../../app/nav'
import { COB } from '../../constants/data'
import { Card, Icone } from '../../components'

export function CotProd() {
  const { go } = useNav()
  return (
    <>
      <p className="mut" style={{ margin: 0 }}>Qual seguro você quer cotar?</p>
      {Object.keys(COB).map((p) => (
        <Card key={p} className="row" onClick={() => go('cot-form', p)}><b>{p}</b><Icone n="shield" /></Card>
      ))}
    </>
  )
}