import { useNav } from '../../app/nav'
import { COB } from '../../constants/data'
import { Card, Icone } from '../../components'

export function Cotacao() {
  const { go } = useNav()
  return (
    <>
      <button className="btn" onClick={() => go('cot-prod')}>Nova cotação</button>
      <h2>Meus pedidos</h2>
      <Card onClick={() => go('cot-det', 0)}>
        <div className="row"><b>Residencial</b><span className="tag ok">Respondida</span></div>
        <div className="mut">Novo seguro · Cobertura: Incêndio · 14/09/2026</div>
      </Card>
      <Card onClick={() => go('cot-det', 1)}>
        <div className="row"><b>Auto</b><span className="tag warn">Em análise</span></div>
        <div className="mut">Renovação · Cobertura: Todas as coberturas · 28/09/2026</div>
      </Card>
    </>
  )
}