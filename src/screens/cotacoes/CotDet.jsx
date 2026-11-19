export function CotDet({ arg }) {
  return arg === 0 ? (
    <div className="card col">
      <div className="row"><h1>Residencial</h1><span className="tag ok">Respondida</span></div>
      <span className="mut">Tipo de cobertura</span><b>Incêndio</b>
      <span className="mut">Valor estimado</span><div className="big">R$ 1.050,00</div>
      <span className="mut">Resposta da BS Seguros</span>
      <span>Condições enviadas pela nossa equipe. Fale conosco para contratar.</span>
    </div>
  ) : (
    <div className="card col">
      <div className="row"><h1>Auto</h1><span className="tag warn">Em análise</span></div>
      <span className="mut">Renovação · 28/09/2026</span>
      <span className="mut">Tipo de cobertura</span><b>Todas as coberturas</b>
      <span>Nossa equipe está analisando seu pedido. Você será avisado quando houver resposta.</span>
    </div>
  )
}