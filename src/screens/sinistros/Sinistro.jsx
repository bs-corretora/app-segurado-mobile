import { useNav } from '../../app/nav'
import { Card, Contato, Selo } from '../../components'

export function Sinistro() {
  const { go } = useNav()
  return (
    <>
      <h2 style={{ marginTop: 0 }}>Contato de sinistro</h2>
      <Contato title="Equipe de sinistros BS Seguros" />
      <button className="btn" onClick={() => go('sin-novo')}>Abrir sinistro</button>
      <h2>Meus sinistros</h2>
      <Card onClick={() => go('sin-det')}>
        <div className="row"><b>SIN-2026-000123</b><Selo s="EM_ANALISE" /></div>
        <div className="mut">Colisão · Auto · 20/09/2026</div>
      </Card>
    </>
  )
}