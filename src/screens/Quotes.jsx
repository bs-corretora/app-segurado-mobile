import { useNav } from '../nav'
import { COB } from '../data'
import { Card, Field, Icon, Select, Tag } from '../ui'

export function Cotacao() {
  const { go } = useNav()
  return (
    <>
      <button className="btn" onClick={() => go('cot-prod')}>Nova cotação</button>
      <h2>Meus pedidos</h2>
      <Card onClick={() => go('cot-det', 0)}>
        <div className="row"><b>Residencial</b><Tag s="RESPONDIDA" /></div>
        <div className="mut">Novo seguro · Cobertura: Incêndio · 14/09/2026</div>
      </Card>
      <Card onClick={() => go('cot-det', 1)}>
        <div className="row"><b>Auto</b><Tag s="EM_ANALISE" /></div>
        <div className="mut">Renovação · Cobertura: Todas as coberturas · 28/09/2026</div>
      </Card>
    </>
  )
}

export function CotProd() {
  const { go } = useNav()
  return (
    <>
      <p className="mut" style={{ margin: 0 }}>Qual seguro você quer cotar?</p>
      {Object.keys(COB).map((p) => (
        <Card key={p} className="row" onClick={() => go('cot-form', p)}><b>{p}</b><Icon n="shield" /></Card>
      ))}
    </>
  )
}

export function CotForm({ arg }) {
  const { go } = useNav()
  return (
    <>
      <div className="card"><span className="mut">Produto</span><br /><b>{arg}</b></div>
      <Select label="Tipo de pedido" options={['Novo seguro', 'Renovação']} />
      <Select label="Tipo de cobertura" options={COB[arg]} />
      <Field label="Telefone para contato" type="tel" placeholder="(00) 00000-0000" />
      <div className="f"><label htmlFor="det">Detalhes do pedido</label><textarea id="det" rows="4" placeholder="Informe o que você precisa" /></div>
      <button className="btn" onClick={() => go('cotacao')}>Enviar pedido</button>
    </>
  )
}

export function CotDet({ arg }) {
  return arg === 0 ? (
    <div className="card col">
      <div className="row"><h1>Residencial</h1><Tag s="RESPONDIDA" /></div>
      <span className="mut">Tipo de cobertura</span><b>Incêndio</b>
      <span className="mut">Valor estimado</span><div className="big">R$ 1.050,00</div>
      <span className="mut">Resposta da BS Seguros</span>
      <span>Condições enviadas pela nossa equipe. Fale conosco para contratar.</span>
    </div>
  ) : (
    <div className="card col">
      <div className="row"><h1>Auto</h1><Tag s="EM_ANALISE" /></div>
      <span className="mut">Renovação · 28/09/2026</span>
      <span className="mut">Tipo de cobertura</span><b>Todas as coberturas</b>
      <span>Nossa equipe está analisando seu pedido. Você será avisado quando houver resposta.</span>
    </div>
  )
}
